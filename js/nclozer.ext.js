// ***************************************************************************************//
// ************************************ ClassCelestialBody *******************************//
// ***************************************************************************************//
function ClassCelestialBody(vType, vId, vBody, vX, vX1, vY, vY1, vSin, vCos, vSpeed)
{
    this.mType = vType;
    this.mId = vId;
    this.mBody = vBody;
    this.mX = vX;
    this.mX1 = vX1;
    this.mY = vY;
    this.mY1 = vY1;
    this.mSin = vSin;
    this.mCos = vCos;
    this.mSpeed = vSpeed;
    this.maHitBox = ClassCelestialBody.maHitBox[vType];
    this.mImage = ClassCelestialBody.maImage[vType];;
}

ClassCelestialBody.mContext = {};
ClassCelestialBody.mSpaceship = new Image();
ClassCelestialBody.maImage = [new Image(),new Image(),new Image()];
ClassCelestialBody.maHitBox = [[[2,6],[52,54]],[[0,5],[124,181]],[[0,5],[179,181]]];

ClassCelestialBody.prototype.run = function (vTick)
{
    var i = this;
    i.mX += i.mSpeed*vTick*i.mSin;
    i.mY += i.mSpeed*vTick*i.mCos;
    return i.mY <= i.mY1;
}

ClassCelestialBody.prototype.isHit = function (vCollision, vX, vY)
{
    var vX0 = Math.floor(vX + 16);
    var vY0 = Math.floor(vY + 27);
    var vW0 = 92;
    var vH0 = 137;
    var vX2 = Math.floor(this.mX + this.maHitBox[0][0]);
    var vY2 = Math.floor(this.mY + this.maHitBox[0][1]);
    var vW2 = this.maHitBox[1][0];
    var vH2 = this.maHitBox[1][1];

    if (vX0 + vW0 >= vX2 && vX2 + vW2 >= vX0 && vY0 + vH0 >= vY2 && vY2 + vH2 >= vY0) {
        var vColX0 = Math.max(vX0, vX2);
        var vColY0 = Math.max(vY0, vY2);
        var vColX1 = Math.min(vX0 + vW0, vX2 + vW2);
        var vColY1 = Math.min(vY0 + vH0, vY2 + vH2);
        var vWidth = Math.min(vColX1 - vColX0 + 1, vW0, vW2);
        var vHeight = Math.min(vColY1 - vColY0 + 1, vH0, vH2);

        ClassCelestialBody.mContext.globalCompositeOperation="copy";
        ClassCelestialBody.mContext.drawImage(ClassCelestialBody.mSpaceship, (vColX0 != vX0)*(vWidth - vW0), (vColY0 != vY0)*(vHeight - vH0));
        ClassCelestialBody.mContext.globalCompositeOperation="destination-in";
        ClassCelestialBody.mContext.drawImage(this.mImage, (vColX0 != vX2)*(vWidth - vW2), (vColY0 != vY2)*(vHeight - vH2));
        var vData = ClassCelestialBody.mContext.getImageData(0, 0, vWidth, vHeight).data;

        for (var i = 0 ; i < vWidth; ++i) {
            for (var j = 0 ; j < vHeight; ++j) {
                if (vData[(i + j*vWidth)*4] > vCollision) {
                    vCollision = vData[(i + j*vWidth)*4];
                }
            }
        }
    }
    return vCollision;
}

ClassCelestialBody.mSpaceship.src = "img/spaceship.png";
ClassCelestialBody.maImage[0].src = "img/asteroid.png";
ClassCelestialBody.maImage[1].src = "img/meteor.png";
ClassCelestialBody.maImage[2].src = "img/boss.png";

// ***************************************************************************************//
// ************************************ ClassNClozerExt **********************************//
// ***************************************************************************************//
function ClassNClozerExt()
{
    ClassNClozer.call(this);

    this.maBackgroundSpeed = [15.0,35.0];
    this.maBodySpeed = [200.0,300.0,175.0];
    this.mLevel = 1020;

    this.mCenter = 400;
    this.mLeft = {layout:0.0, viewport:0.0};
    this.mRight = {layout:0.0, viewport:0.0};
    this.mId = 0;
    this.mX = 0;
    this.mY = 0;
    this.mRunId = 0;
    this.mGameState = 0;
    this.mCoinState = 0;
    this.mCoinDistance = 0.0;
    this.mCoinLeft = 0.0;
    this.mCoinTop = 0.0;
    this.mInsertLeft = 0.0;
    this.mInsertTop = 0.0;

    this.mTime = 0.0;
    this.mTimeNext = 0.0;
    this.mTimeFirst = 0.0;

    this.maColor = [0,0,0];
    this.maColor1 = [0,0,0];
    this.maColor2 = [0,0,0];
    this.mColor = 0;
    this.mColor1 = 0;
    this.mColorStep = 0;

    this.mHit = null;
    this.mSin = 0.0;
    this.mCos = 0.0;
    this.mSpeed = 0.0;

    this.mSurface = null;
    this.maAnimation = new Array(30);
    this.maCoin = new Array(4);
    this.maSpaceShip = new Array(3);
    this.maBody = new Array(30);
    this.maBackground = new Array(4);
    this.maBackgroundHeight = [0, 0];
    this.maBackgroundWidth = [0, 0];
    this.maBackgroundTop = [0.0, 0.0, 0.0, 0.0];
    this.maTypeCounter = [0, 0, 0];

    this.mNavAnim = {top:0};
    this.mNavReset = {top:0};
    this.mOverlay = null;
    this.mOverlayState = 0;
    this.mWidthState = 0;
    this.mHeightStateMin = 0;
    this.mHeightStateMax = 0;

    this.gameStep = null;
}

ClassNClozerExt.prototype = ClassNClozer.prototype;

ClassNClozerExt.prototype.animationCreate = function ()
{
    var i = this;
    var vX0 = i.mLeft.layout - 80 + Math.random()*800;
    var vX1 = i.mLeft.layout - 80 + Math.random()*800;
    var vY0 = -300;
    var vY1 = i.mHeight.viewport*1.1;
    var vDistance = Math.sqrt(Math.pow(vX1 - vX0, 2) + Math.pow(vY1 - vY0, 2));
    var vTypeRand = Math.random();
    var vType = (vTypeRand > 0.49) + (vTypeRand > 0.90);
    var vId = i.maTypeCounter[vType]++%10 + 10*vType;

    return new ClassCelestialBody(vType, vId, i.maBody[vId], vX0, vX1, vY0, vY1, (vX1 - vX0)/vDistance, (vY1 - vY0)/vDistance, i.maBodySpeed[vType]);
}

ClassNClozerExt.prototype.coinDragStart = function (vEvent, vId)
{
    var i = this;

    i.mCoinState = vId;
    i.maCoin[1].ontouchmove = function (vEvent) { return i.mouseMove(vEvent.targetTouches[0]); };
    i.maCoin[1].onmousemove = function (vEvent) { return i.mouseMove(vEvent); };
    return true;
}

ClassNClozerExt.prototype.coinDragEnd = function (vEvent, vId)
{
    var i = this;

    i.mCoinState = 0;
    i.maCoin[1].ontouchmove = function (vEvent) { return true; };
    i.maCoin[1].onmousemove = function (vEvent) { return true; };
    return true;
}

ClassNClozerExt.prototype.gameEnd = function ()
{
    var i = this;

    $(".iCoin").animate({
      opacity:1.0
    }, 1100);
}

ClassNClozerExt.prototype.gameKey = function (vEvent)
{
    var i = this;

    if (vEvent.keyCode == 13) {
        i.mOverlayState = !i.mOverlayState;
    }
    if (vEvent.keyCode == 27) {
        i.mStop = 1;
    }
    return true;
}

ClassNClozerExt.prototype.gamePlay = function ()
{
    var i = this;
    var vIndex = 30;

    i.setVisibility(i.maCoin[0], false);
    i.setVisibility(i.maCoin[1], false);
    i.resize(true);
    i.maCoin[1].ontouchmove = function (vEvent) { return true; };
    i.maCoin[1].onmousemove = function (vEvent) { return true; };
    i.mSurface.ontouchstart = function (vEvent) { return i.mouseMove(vEvent.targetTouches[0]); };
    i.mSurface.ontouchmove = function (vEvent) { return i.mouseMove(vEvent.targetTouches[0]); };
    i.mSurface.onmousemove = function (vEvent) { return i.mouseMove(vEvent); };
    i.setVisibility(i.maSpaceShip[0], true);
    i.mCoinState = 0;
    i.mId = 0;
    i.gameStep = i.gameRun;

    while (vIndex--) {
        if (i.maAnimation[vIndex]) {
            i.maAnimation[vIndex] = null;
        }
        i.setPixel(i.maBody[vIndex], "top", -300);
    }
    i.mTime = 0.0;
    i.mTimeNext = 0.0;
    i.mTimeFirst = 0.0;
    i.mGameState = 1;
    i.mStop = 0;
    i.gameStep = i.gameRun;

    i.maColor = [25,25,25];
    i.mColor1 = Math.round(Math.random()*2);
    i.mColor = Math.round(Math.random()*2);
    i.mColor = (i.mColor + (i.mColor == i.mColor1))%3;
    i.maColor[i.mColor] = 130;
    i.maColor[i.mColor1] = 145;
    i.mColorStep = 5;
    i.mSpeed = 0.0;

    $(".video").each(function () { this.pause(); });
    $("#iTextContainer").hide();
    $("#iSurface,.a").css({backgroundColor:"#000000"});
    $(".highlightContainer, .iTable.iHeader").css({visibility:"hidden"});
    $("html,body").animate({scrollTop: $("#iSurface").offset().top}, 2100);
    $(".iNavBar").animate(i.mNavAnim, 2100);
    $("#iGameSound").get(0).play();
    $("#iGameSound").animate({
      volume:1.0
    }, 1100);
    $(".iNavBar").promise().done(function () {
        $(".iNavBar").css({visibility:"hidden"});
        $("#iUnder").hide();
        $("#iAbove").hide();
        $(i.mOverlay).show();
    });

    i.setVisibility(i.maBackground[0], true);
    i.setVisibility(i.maBackground[1], true);
    i.setVisibility(i.maBackground[2], true);
    i.setVisibility(i.maBackground[3], true);

    i.mBackgroundHeight = [i.maBackground[0].clientHeight,i.maBackground[2].clientHeight];
    i.mBackgroundWidth = [i.maBackground[0].clientWidth,i.maBackground[2].clientWidth];
    i.maBackgroundTop = [0.0, -i.mBackgroundHeight[0], 0.0, -i.mBackgroundHeight[1]];

    i.setPixel(i.maBackground[0], "left", i.mCenter+25 - i.mBackgroundWidth[0]/2);
    i.setPixel(i.maBackground[1], "left", i.mCenter+25 - i.mBackgroundWidth[0]/2);
    i.setPixel(i.maBackground[2], "left", i.mCenter-25 - i.mBackgroundWidth[1]/2);
    i.setPixel(i.maBackground[3], "left", i.mCenter-25 - i.mBackgroundWidth[1]/2);

    $(".iBody,.iBackground").animate({opacity:1.0}, 750);
    i.mRunId = frameRun(function (vTime) { i.gameStep(vTime); });
}

ClassNClozerExt.prototype.gameRun = function (vTime)
{
    var i = this;
    var vAnim = null;
    var vIndex = 30;
    var vTick = Math.min((vTime - i.mTime)/1000.0, 1.0);
    var vCollision = 0;

    frameStop(i.mRunId);
    i.mTimeFirst += (!i.mTimeFirst)*vTime;
    i.mTimeNext += (!i.mTimeNext)*(vTime + 1500);
    i.maColor[i.mColor] += i.mColorStep;
    i.maColor[i.mColor1] -= i.mColorStep;

    if (i.maColor[i.mColor1] == 25) {
        i.mColorStep = 1 + 2*(i.mSpeed/(vTime - i.mTimeFirst) <= 0.05) + 2*(i.mSpeed/(vTime - i.mTimeFirst) <= 0.02);
        i.mColor1 = i.mColor;
        i.mColor = Math.round(Math.random()*2);
        i.mColor = (i.mColor + (i.mColor == i.mColor1))%3;
    }
    i.maBackgroundTop[0] = i.maBackgroundTop[0] + i.maBackgroundSpeed[0]*vTick;
    i.maBackgroundTop[1] = i.maBackgroundTop[1] + i.maBackgroundSpeed[0]*vTick;
    i.maBackgroundTop[2] = i.maBackgroundTop[2] + i.maBackgroundSpeed[1]*vTick;
    i.maBackgroundTop[3] = i.maBackgroundTop[3] + i.maBackgroundSpeed[1]*vTick;

    if (i.maBackgroundTop[0] > i.mHeight.viewport) {
        i.maBackgroundTop[0] = i.mHeight.viewport - 2*i.mBackgroundHeight[0];
    } else if (i.maBackgroundTop[1] > i.mHeight.viewport) {
        i.maBackgroundTop[1] = i.maBackgroundTop[0] - 2*i.mBackgroundHeight[0];
    }
    if (i.maBackgroundTop[2] > i.mHeight.viewport) {
        i.maBackgroundTop[2] = i.mHeight.viewport - 2*i.mBackgroundHeight[2];
    } else if (i.maBackgroundTop[3] > i.mHeight.viewport) {
        i.maBackgroundTop[3] = i.maBackgroundTop[2] - 2*i.mBackgroundHeight[2];
    }
    if (vTime > i.mTimeNext) {
        vAnim = i.animationCreate();

        if (!i.maAnimation[vAnim.mId]) {
            i.maAnimation[vAnim.mId] = vAnim;
            i.mTimeNext = i.mTime + Math.random()*i.mLevel; //vTime
        }
        if (i.mStop) {
            i.mGameState = 0;
            i.mTimeFirst = vTime - i.mTimeFirst;
            i.gameStep = i.gameSleep;
        }
    }
    while (vIndex--) {
        vAnim = i.maAnimation[vIndex];

        if (vAnim && vAnim.run(vTick)) {
            i.setPixel(vAnim.mBody, "left", vAnim.mX);
            i.setPixel(vAnim.mBody, "top", vAnim.mY);
            vCollision = vAnim.isHit(vCollision, i.mX, i.mY);

            if (i.mGameState && vCollision >= 70) {
                i.mGameState = 0;
                i.mHit = vAnim.mBody;
                i.mSin = vAnim.mSin;
                i.mCos = vAnim.mCos;
                i.mSpeed = vAnim.mSpeed*-0.3;
                i.mTimeFirst = vTime - i.mTimeFirst;
                vAnim.mSpeed = vAnim.mSpeed*0.5;
                i.maColor2[0] = i.maColor[0];
                i.maColor2[1] = i.maColor[1];
                i.maColor2[2] = i.maColor[2];
                i.mTimeNext = i.mTime*10000
                $(".c").css({color:"#FFBBBB"});
            }
        } else {
            i.maAnimation[vIndex] = null;
        }
    }
    if (i.mGameState) {
        if (vCollision >= 60) {
            $(".b").css({color:"#FFFFFF"});
        } else {
            $(".b").css({color:"inherit"});
        }
        $("#iSurface").css({color:"rgb(" + i.maColor[0] + "," + i.maColor[1] + "," + i.maColor[2] + ")"});
        i.mSpeed += 1.0;
        $(i.mOverlay).html(
            "Distance: " + Math.round((vTime - i.mTimeFirst)/360) +
            (i.mOverlayState ? "<br>FPS: " + Math.floor(i.mSpeed/(vTime - i.mTimeFirst)*1000) : "" )
        );
    } else {
        i.maColor2[0] = Math.max(0, i.maColor2[0] - i.mColorStep*3);
        i.maColor2[1] = Math.max(0, i.maColor2[1] - i.mColorStep*3);
        i.maColor2[2] = Math.max(0, i.maColor2[2] - i.mColorStep*3);
        $("#iSurface").css({color:"rgb(" + i.maColor2[0] + "," + i.maColor2[1] + "," + i.maColor2[2] + ")"});
        $(i.mHit).css({color:"rgb(" + i.maColor[0] + "," + i.maColor[1] + "," + i.maColor[2] + ")"});
        $(i.maSpaceShip[0]).css({color:"rgb(" + i.maColor[0] + "," + i.maColor[1] + "," + i.maColor[2] + ")"});
        $(".b").css({color:"#FFFFFF"});
        i.mX += i.mSpeed*vTick*i.mSin;
        i.mY -= i.mSpeed*vTick*i.mCos;

        if (i.mY > i.mHeight.viewport) {
            i.gameStep = i.gameSleep;
        }
        i.setPixel(i.maSpaceShip[0], "top", i.mY);
    }
    i.setPixel(i.maSpaceShip[0], "left", i.mX);
    i.setPixel(i.maBackground[0], "top", i.maBackgroundTop[0]);
    i.setPixel(i.maBackground[1], "top", i.maBackgroundTop[1]);
    i.setPixel(i.maBackground[2], "top", i.maBackgroundTop[2]);
    i.setPixel(i.maBackground[3], "top", i.maBackgroundTop[3]);
    i.mTime = vTime;
    i.mRunId = frameRun(function (vTime) { i.gameStep(vTime); });
}

ClassNClozerExt.prototype.gameSleep = function (vTime)
{
    var i = this;

    frameStop(i.mRunId);

    i.mSurface.ontouchstart = function (vEvent) { return true; };
    i.mSurface.ontouchmove = function (vEvent) { return true; };
    i.mSurface.onmousemove = function (vEvent) { return true; };
    i.setVisibility(i.maBackground[0], false);
    i.setVisibility(i.maBackground[1], false);
    i.setVisibility(i.maBackground[2], false);
    i.setVisibility(i.maBackground[3], false);
    i.setVisibility(i.maSpaceShip[0], false);

    $(i.mOverlay).hide();
    $("#iAbove").show();
    window.scrollTo(0, $("#iSurface").offset().top);
    $("#iUnder").show();
    $(".iNavBar").css(i.mNavAnim);
    $(".iNavBar").css({visibility:"visible"});
    $(".iNavBar").animate(i.mNavReset, 1200);
    $("html,body").animate({scrollTop: $("#74LightYearsAway").offset().top}, 1200);

    i.resize(false);
    $("#iSurface,.iSpaceShip,.b, .c").css({color:"inherit"});
    $(i.mHit).css({color:"inherit"});
    $("#iPlay,#iEnd,.iBody,.iBackground,.iCoin").css({opacity:0.0});
    $("#iSurface,.a").css({backgroundColor:"inherit"});

    i.setVisibility(i.maCoin[0], true);
    i.setVisibility(i.maCoin[1], true);

    $("#iEnd").html("Congratulations!! You went " + Math.round(i.mTimeFirst/360) + " light-years away!");
    $("#iTextContainer").show();

    $("#iGameSound").animate({volume:0.0}, 2750);
    $("#iGameSound").promise().done(function() {
        $("#iGameSound").get(0).pause();
    });
    $("#iEnd").animate({opacity:1.0}, 2100);
    $("#iEnd").promise().done(function() {
        $("#iTextContainer").animate({opacity:1.0}, 200);
        $("#iTextContainer").promise().done(function() {
            $("#iPlay").css({opacity:1.0});
            $(".highlightContainer,.iTable.iHeader").css({visibility:"visible"});
            $("#iEnd").animate({opacity:0.0}, 1100);
            $("#iEnd").promise().done(function() {
                i.gameEnd();
            });
        });
    });
}

ClassNClozerExt.prototype.create = function ()
{
    var vIndex;
    var i = this;

    i.init();

    for (vIndex = 0 ; vIndex < 2 ; ++vIndex) {
        i.maCoin[vIndex] = document.getElementById("iCoin" + vIndex);
    }
    for (vIndex = 0 ; vIndex < 1 ; ++vIndex) {
        i.maSpaceShip[vIndex] = document.getElementById("iSpaceShip" + vIndex);
    }
    for (vIndex = 0 ; vIndex < 30 ; ++vIndex) {
        i.maBody[vIndex] = document.getElementById("iBody" + vIndex);
    }
    for (vIndex = 0 ; vIndex < 4 ; ++vIndex) {
        i.maBackground[vIndex] = document.getElementById("iBackground" + vIndex);
    }
    i.mSurface = document.getElementById("iSurface");
    i.mOverlay = document.getElementById("iOverlay");

    window.onresize = function (vEvent) { return i.resize(false); };
    i.resize(false);

    $(".iNavLink").click(function(vEvent) { return i.navigate($(this).attr("href"), 500); });
    $(".iBody,.iBackground").css({opacity:0.0});
}

ClassNClozerExt.prototype.load = function ()
{
    var i = this;

    ClassCelestialBody.mContext = document.getElementById("iCanvas").getContext("2d");
    document.getElementById("iGameSound").volume = 0.0;
    document.getElementById("iGameSound").loop = true;

    document.onkeydown = function (vEvent) { return i.gameKey(vEvent); };
    i.mBody.ontouchend = function (e) { return i.coinDragEnd(e,1); };
    i.mBody.onmouseup = function (e) { return i.coinDragEnd(e,1); };
    i.maCoin[1].ontouchstart = function (e) { i.mLevel = 2700; return i.coinDragStart(e,1); };
    i.maCoin[1].onmousedown = function (e) { return i.coinDragStart(e,1); };
}

ClassNClozerExt.prototype.mouseMove = function (vEvent)
{
    if (this.mGameState) {
        this.mX = Math.min(Math.max(vEvent.pageX - this.maSpaceShip[0].clientWidth/2, this.mLeft.viewport - this.maSpaceShip[0].clientWidth/2), this.mRight.viewport - this.maSpaceShip[0].clientWidth/2);
    } else if (this.mCoinState) {
        var i = this;
        var vX = Math.min(Math.max(vEvent.pageX - this.maSpaceShip[0].clientWidth/2, i.mLeft.viewport - this.maSpaceShip[0].clientWidth/2), i.mRight.viewport - this.maSpaceShip[0].clientWidth/2);
        var vY = Math.max(vEvent.pageY - this.maCoin[1].clientHeight/2 - i.mSurface.offsetTop, 0);
        var vDistance = Math.sqrt(Math.pow(i.mInsertLeft - vX, 2), Math.pow(i.mInsertTop - vY, 2));
        var vTop = i.mHeight.viewport/2 + (i.mCoinDistance - vDistance)/i.mCoinDistance*i.mHeight.viewport/8;

        i.setPixel(i.maCoin[0], "top", vTop);
        i.setPixel(i.maCoin[1], "left", vX);
        i.setPixel(i.maCoin[1], "top",  vY);
        i.setPixel(i.maSpaceShip[0], "left", vX);

        if (vX >= i.mInsertLeft - this.maSpaceShip[0].clientWidth/4 && vY >= vTop) {
            i.gamePlay();
        }
    }
    return false;
}

ClassNClozerExt.prototype.navigate = function (vHref, vDuration)
{
    var i = this;
    var vVideo = $(vHref + "Video");

    i.resize(false);
    $(".video").each(function () { this.pause(); });
    $("html,body").animate({scrollTop: $(vHref).offset().top}, vDuration);

    if (vVideo.length) {
        vVideo.get(0).play();
    }
    return false;
}

ClassNClozerExt.prototype.resize = function (vForce)
{
    var i = this;

    i.mWidth.update();
    i.mHeight.update();

    if (i.mWidth.viewport != i.mWidthState) {
        i.mWidthState = i.mWidth.viewport;
        i.mHeightStateMin = i.mHeight.viewport;
        i.mHeightStateMax = i.mHeight.viewport;
    }
    i.mHeightStateMin = Math.min(i.mHeightStateMin, i.mHeight.viewport);
    i.mHeightStateMax = Math.max(i.mHeightStateMax, i.mHeight.viewport);

    var w, h, d, vSurfaceHeight;
    var vaImage = [[3072,1677]];
    var vaPrintScreen = [[1024,720]];

    $(".iLandingBox").css({width:"1px",height:"5000px"});
    $(".iLandingLink").css({width:"1px",height:"5000px"});
    $(".iLandingCell").css({width:"1px",height:"5000px"});
    $(".iLandingText").css({width:"1px",height:"5000px"});
    $(".iVideoBox").css({width:"1px",height:"5000px"});
    $(".iSurfaceBox").css({height:"5000px"});

    $("#iVideoContainer1").css({width:"1px",height:"5000px"});
    $("#iVideoContainer2").css({width:"1px",height:"5000px"});
    $("#iVideoContainer3").css({width:"1px",height:"5000px"});
    $("#iTextContainer").css({width:"1px"});

    $(".iCropBox").css({width:"1px",height:"5000px"});
    $(".iImageBox").css({width:"1px",height:"5000px"});
    $(".iImageContent").css({width:"1px",height:"5000px"});

    i.mCenter = i.mWidth.viewport/2;
    i.mLeft.layout = i.mCenter - 320.0;
    i.mRight.layout = i.mCenter + 320.0;
    i.mLeft.viewport = Math.max(i.mCenter - 320.0, 0.0);
    i.mRight.viewport = Math.min(i.mCenter + 320.0, i.mWidth.viewport);

    if (i.mWidth.viewport >= 640 && i.mHeight.viewport >= 640) {
        document.getElementById("iLayout").className = "iLayout1";

        var vHeader = 34;
        var vBadge = 28;
        var vBottom = 14;

        w = i.mWidth.viewport;
        h = i.mHeight.viewport - vHeader;
        i.mNavAnim = {top:"-35px"};
        i.mNavReset = {top:"0px"};
        vSurfaceHeight = i.mHeight.viewport;

        $(".iNavBar2, .iNavBar2 .iTable").css({height:"32px"});
        $(".highlightContainer, .iTable.iHeader").css({height:"70px"});
        $(".iLandingBox").css({width:w + "px",height:1.2*h + "px"});
        $(".iVideoBox").css({width:w + "px",height:1.2*h + "px",paddingTop:0.2*h + "px"});
        $(".iSurfaceBox").css({height:vSurfaceHeight + "px"});
        $(".iContactBox .highlightContainer, .iContactBox .iHeader").css({top:Math.ceil(0.2*h) + "px"});
        $(".iContactLink").css({paddingBottom:"112px"});

        var vMargin = 0.067*w;
        var vAbove = 70 + vMargin;
        var vUnder = vMargin;
        var w1 = w/1.61803 - vMargin;
        var w2 = w/2.61803 - vMargin;
        var w0 = w1 + w2;
        var h1 = (h - vAbove - vUnder)/4;

        $(".iLandingContainer").css({top:(vHeader + vAbove) + "px",left:(i.mWidth.viewport - w0)/2 + "px"});
        $(".iLandingLink").css({width:w0 + "px",height:h1 + "px"});
        $(".iLandingCell").css({width:w1 + "px",height:h1 + "px"});

        w1 -= 14;
        w2 -= 14;
        h1 -= 14;
        $(".iLandingText").css({width:w2 + "px",height:h1 + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox1").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox1 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-9*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox2").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox2 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-11*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox3").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox3 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-5*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox4").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox4 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-13*d.mh/12 + "px",left:-d.mw + "px"});

        vAbove = 70 + 14;
        d = i.clipMax(1280, 720 + 100, w, h - vAbove - vBadge);
        $("#iVideoContent1").css({padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});
        $("#iVideoContainer1").css({width:d.w + "px",height:d.h + "px",fontSize:d.h + "px"});

        d = i.clipMax(1024, 768, w, h - vAbove - vBottom);
        $("#iVideoContainer2").css({width:d.w + "px",height:d.h + "px",padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});

        d = i.clipMax(1024, 768, w, h - vAbove - vBottom);
        $("#iVideoContainer3").css({width:d.w + "px",height:d.h + "px",padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});

        $("#iTextContainer").css({width:w + "px",height:0.5*vSurfaceHeight + "px"});

        vAbove = Math.ceil(1.2*h - 198 - 42);
        d = i.crop(vaImage[0][0], vaImage[0][1], w, vAbove);
        $("#iImageBox1").css({width:w + "px",height:vAbove + "px"});
        $("#iImageBox1 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-2*d.mh + "px",left:-3*d.mw/2 + "px"});
    } else if (i.mWidth.viewport/i.mHeight.viewport < 16/9) {
        document.getElementById("iLayout").className = "iLayout2";

        var vHeader = 34;
        var vBadge = 0;
        var vBottom = 7;

        w = i.mWidth.viewport;
        h = i.mHeightStateMax - vHeader;
        vSurfaceHeight = ( vForce ? i.mHeight.viewport : 1.2*h );
        i.mNavAnim = {top:"-35px"};
        i.mNavReset = {top:"0px"};

        $(".iNavBar2, .iNavBar2 .iTable").css({height:"32px"});
        $(".highlightContainer, .iTable.iHeader").css({height:"56px"});
        $(".iLandingBox").css({width:w + "px",height:1.2*h + "px"});
        $(".iVideoBox").css({width:w + "px",height:1.2*h + "px",paddingTop:0.2*h + "px"});
        $(".iSurfaceBox").css({height:vSurfaceHeight + "px"});
        $(".iContactBox .highlightContainer, .iContactBox .iHeader").css({top:Math.ceil(0.2*(i.mHeightStateMin - vHeader)) + "px"});
        $(".iContactLink").css({paddingBottom:(i.mHeightStateMax - i.mHeightStateMin + 42) + "px"});

        h = i.mHeightStateMin - vHeader;
        vSurfaceHeight = ( vForce ? i.mHeight.viewport : i.mHeightStateMin );
        var vMargin = 7;
        var vAbove = 56 + vMargin;
        var vUnder = vMargin;
        var w1 = w/1.61803 - vMargin;
        var w2 = w/2.61803 - vMargin;
        var w0 = w1 + w2;
        var h1 = (h - vAbove - vUnder)/4;

        $(".iLandingContainer").css({top:(vHeader + vAbove) + "px",left:(i.mWidth.viewport - w0)/2 + "px"});
        $(".iLandingLink").css({width:w0 + "px",height:h1 + "px"});
        $(".iLandingCell").css({width:w1 + "px",height:h1 + "px"});

        w1 -= 2;
        w2 -= 2;
        h1 -= 2;
        $(".iLandingText").css({width:w2 + "px",height:h1 + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox1").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox1 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-9*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox2").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox2 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-11*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox3").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox3 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-5*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox4").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox4 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-13*d.mh/12 + "px",left:-d.mw + "px"});

        d = i.clipMax(1280, 720 + 100, w, h - vAbove - vBadge);
        $("#iVideoContent1").css({padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});
        $("#iVideoContainer1").css({width:d.w + "px",height:d.h + "px",fontSize:d.h + "px"});

        d = i.clipMax(1024, 768, w, h - vAbove - vBottom);
        $("#iVideoContainer2").css({width:d.w + "px",height:d.h + "px",padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});

        d = i.clipMax(1024, 768, w, h - vAbove - vBottom);
        $("#iVideoContainer3").css({width:d.w + "px",height:d.h + "px",padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});

        $("#iTextContainer").css({width:w + "px",height:0.5*vSurfaceHeight + "px"});

        vAbove = Math.ceil(1.2*h - 117);
        d = i.crop(vaImage[0][0], vaImage[0][1], w, vAbove);
        $("#iImageBox1").css({width:w + "px",height:vAbove + "px"});
        $("#iImageBox1 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-2*d.mh + "px",left:-3*d.mw/2 + "px"});
    } else {
        document.getElementById("iLayout").className = "iLayout3";

        var vHeader = 37;
        var vBadge = 0;
        var vBottom = 0;

        w = i.mWidth.viewport - vHeader;
        h = i.mHeightStateMax;
        vSurfaceHeight = ( vForce ? i.mHeight.viewport : 1.2*h );
        i.mNavAnim = {right:"-38px"};
        i.mNavReset = {right:"0px"};

        $(".iNavBar2").css({height:"100%"});
        $(".iNavBar2 .iTable, .highlightContainer, .iTable.iHeader").css({height:i.mHeightStateMin + "px"});
        $(".iLandingBox").css({width:w + "px",height:1.2*h + "px"});
        $(".iVideoBox").css({width:w + "px",height:1.2*h + "px",paddingTop:0.2*h + "px"});
        $(".iSurfaceBox").css({height:vSurfaceHeight + "px"});
        $(".iContactBox .highlightContainer, .iContactBox .iTable.iHeader").css({top:Math.ceil(0.2*i.mHeightStateMin) + "px"});
        $(".iContactLink").css({paddingBottom:(i.mHeightStateMax - i.mHeightStateMin + 42) + "px"});

        h = i.mHeightStateMin;
        vSurfaceHeight = ( vForce ? i.mHeight.viewport : i.mHeightStateMin );
        var vMargin = 7;
        var vAbove = vMargin;
        var vUnder = vMargin;
        var w1 = (w - 135)/1.61803 - vMargin;
        var w2 = (w - 135)/2.61803 - vMargin;
        var w0 = w1 + w2;
        var h1 = (h - vAbove - vUnder)/4;

        $(".iLandingContainer").css({top:vAbove + "px",left:vMargin + "px"});
        $(".iLandingLink").css({width:w0 + "px",height:h1 + "px"});
        $(".iLandingCell").css({width:w1 + "px",height:h1 + "px"});

        w1 -= 2;
        w2 -= 2;
        h1 -= 2;
        $(".iLandingText").css({width:w2 + "px",height:h1 + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox1").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox1 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-9*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox2").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox2 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-11*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox3").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox3 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-5*d.mh/8 + "px",left:-d.mw + "px"});

        d = i.crop(vaPrintScreen[0][0], vaPrintScreen[0][1], w1, h1);
        $("#iCropBox4").css({width:w1 + "px",height:h1 + "px"});
        $("#iCropBox4 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-13*d.mh/12 + "px",left:-d.mw + "px"});

        $("#iTextContainer").css({width:w + "px",height:0.5*vSurfaceHeight + "px"});

        vAbove = Math.floor(1.2*h - 117);
        d = i.crop(vaImage[0][0], vaImage[0][1], w, vAbove);
        $("#iImageBox1").css({width:w + "px",height:vAbove + "px"});
        $("#iImageBox1 .iImageContent").css({width:d.w + "px",height:d.h + "px",top:-2*d.mh + "px",left:-3*d.mw/2 + "px"});

        w -= 135 + 7;
        vAbove = 0;
        d = i.clipMax(1280, 720 + 100, w, h - vAbove - vBadge);
        $("#iVideoContent1").css({padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});
        $("#iVideoContainer1").css({width:d.w + "px",height:d.h + "px",fontSize:d.h + "px"});

        d = i.clipMax(1024, 768, w, h - vAbove - vBottom);
        $("#iVideoContainer2").css({width:d.w + "px",height:d.h + "px",padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});

        d = i.clipMax(1024, 768, w, h - vAbove - vBottom);
        $("#iVideoContainer3").css({width:d.w + "px",height:d.h + "px",padding:(vAbove + d.mh) + "px " + d.mw + "px 0px " + d.mw + "px"});
    }
    i.mX = i.mLeft.viewport;
    i.mY = vSurfaceHeight*5/8;

    i.mInsertLeft = i.mRight.viewport - i.maCoin[0].clientWidth - 40;
    i.mInsertTop = vSurfaceHeight*5/8;
    i.mCoinLeft = i.mLeft.viewport;
    i.mCoinTop = vSurfaceHeight/2;
    i.mCoinDistance = Math.sqrt(Math.pow(i.mInsertLeft - i.mCoinLeft, 2) + Math.pow(i.mInsertTop - i.mCoinTop, 2));

    i.setPixel(i.maCoin[0], "left", i.mInsertLeft);
    i.setPixel(i.maCoin[0], "top", i.mCoinTop);
    i.setPixel(i.maCoin[1], "left", i.mCoinLeft);
    i.setPixel(i.maCoin[1], "top", i.mCoinTop);
    i.setPixel(i.maSpaceShip[0], "left", i.mX);
    i.setPixel(i.maSpaceShip[0], "top", i.mY);
    return true;
}

var kNClozer = new ClassNClozerExt();
