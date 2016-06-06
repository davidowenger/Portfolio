// ***************************************************************************************//
// ********************************** ClassAnimation *************************************//
// ***************************************************************************************//
function ClassAnimation()
{
}

// ***************************************************************************************//
// ************************************ ClassMinMax **************************************//
// ***************************************************************************************//
function ClassMinMax(maFunc)
{
    this.min = null;
    this.max = null;
    this.viewport = null;
    this.layout = null;

    var index = maFunc.length;

    while (index) {
        var value = maFunc[--index]();

        if (value && typeof(value) != typeof(undef)) {
            if (this.viewport === null || value < this.viewport) {
                this.min = maFunc[index];
                this.viewport = this.min();
            }
            if (this.layout === null || value > this.layout) {
                this.max = maFunc[index];
                this.layout = this.max();
            }
        }
    }
};

ClassMinMax.prototype.update = function ()
{
    this.viewport = this.min();
    this.layout = this.max();
};

// ***************************************************************************************//
// ********************************** ClassNClozer ***************************************//
// ***************************************************************************************//
function ClassNClozer()
{
    var i = this;

    this.mBody = null;
    this.mHTML = null;
    this.getScroll = null;

    this.maFuncWidth = [
        function () { return window.innerWidth; },
        function () { return i.mHTML.clientWidth; },
        function () { return i.mBody.clientWidth; }
    ];
    this.maFuncHeight = [
        function () { return window.innerHeight; },
        function () { return i.mHTML.clientHeight; },
        function () { return i.mBody.clientHeight; }
    ];
    this.maFuncScroll = [
        function () { return i.mHTML.scrollTop; },
        function () { return window.pageYOffset; }
    ];
}

ClassNClozer.prototype.clip = function (width, height, w, h)
{
    var dim = {w:width,h:height,mw:0,mh:0};

    if (w/h > dim.w/dim.h) {
        dim.w = Math.floor(dim.w*h/dim.h);
        dim.h = h;
    } else {
        dim.h = Math.floor(dim.h*w/dim.w);
        dim.w = w
    }
    if (dim.w < w) {
        dim.mw = Math.floor((w - dim.w)/2);
    }
    if (dim.h < h) {
        dim.mh = Math.floor((h - dim.h)/2);
    }
    return dim;
};

ClassNClozer.prototype.clipMax = function (width, height, W, H)
{
    var dim = {w:width,h:height,mw:0,mh:0};
    w = Math.min(W,width);
    h = Math.min(H,height);

    if (w/h > dim.w/dim.h) {
        dim.w = Math.floor(dim.w*h/dim.h);
        dim.h = h;
    } else {
        dim.h = Math.floor(dim.h*w/dim.w);
        dim.w = w
    }
    if (dim.w < W) {
        dim.mw = Math.floor((W - dim.w)/2);
    }
    if (dim.h < H) {
        dim.mh = Math.floor((H - dim.h)/2);
    }
    return dim;
};

ClassNClozer.prototype.crop = function (width, height, w, h)
{
    var dim = {w:width,h:height,mw:0,mh:0};

    if (dim.w/dim.h > w/h) {
        dim.w = Math.ceil(dim.w*h/dim.h);
        dim.h = h;
    } else {
        dim.h = Math.ceil(dim.h*w/dim.w);
        dim.w = w;
    }
    if (dim.w > w) {
        dim.mw = Math.floor((dim.w - w)/2);
    }
    if (dim.h > h) {
        dim.mh = Math.floor((dim.h - h)/2);
    }
    return dim;
};

ClassNClozer.prototype.init = function ()
{
    var i = this;
    var vIndex = i.maFuncScroll.length;

    window.frameRun =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (f) { return window.setTimeout(function () { return f((new Date()).getTime()); }, 50); };
    window.frameStop =
        window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (vcId) { window.clearTimeout(vcId); };
    i.mBody = document.body;
    i.mHTML = document.documentElement;

    if (!i.mBody) {
        i.mBody = document.getElementsByTagName("BODY")[0];
    }
    if (!i.mHTML) {
        i.mHTML = document.getElementsByTagName("HTML")[0];
    }
    if (!i.mBody) {
        i.mBody = {};
    }
    if (!i.mHTML) {
        i.mHTML = {};
    }
    i.mWidth = new ClassMinMax(i.maFuncWidth);
    i.mHeight = new ClassMinMax(i.maFuncHeight);

    while (vIndex) {
        if (typeof(i.maFuncScroll[--vIndex]()) != typeof(undef)) {
            i.getScroll = i.maFuncScroll[vIndex];
        }
    }
}

ClassNClozer.prototype.load = function ()
{
    this.init();
}

ClassNClozer.prototype.resize = function (e)
{
    this.mWidth.update();
    this.mHeight.update();
}

ClassNClozer.prototype.setPixel = function (vNode, vAttribute, vValue)
{
    vNode.style[vAttribute] = vValue + "px";
}

ClassNClozer.prototype.setVisibility = function (vNode, vIsVisible)
{
    vNode.style["visibility"] = ( vIsVisible ? "visible" : "hidden" );
}
