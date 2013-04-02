var Draggable = function(element, options) {
  this.orgEl = element;    // original clicked element 
  this.orgCssText = null;  // original style css text
  this.el = null;          // element to be dragged. original or cloned one
  this.tmpArea = null;     // when drag starts, create a temporary dragging area so that mouse can move around
  this.startedWith = null; // status of when drag starts
  this.options = null;
  this.init = function(element, options) {
    if (options) {
      this.options = options;
      if (!this.options.boundary)  {
        this.options.boundary = document.body;
      }
    }
    element.addEventListener("mousedown", this.start, false);
  };
  var that = this;
  this.start = function(event) {
    if (!that.tmpArea) {
      // setup dragging Area
      var boundaryRect = that.options.boundary.getBoundingClientRect();
      var tmpArea = document.createElement('div');
      tmpArea.style.cssText = "position:absolute; border: 1px dotted black; "+
        "width:"+boundaryRect.width+"px; height:"+boundaryRect.height+"px; "+
        "top:"+boundaryRect.top+"px; left:"+boundaryRect.left+"px";
      document.body.appendChild(tmpArea);
      tmpArea.addEventListener('mousemove',that.drag, false);
      tmpArea.addEventListener('mouseup',that.end, true);
      that.tmpArea = tmpArea;

      // setup dragging object
      var rect = that.orgEl.getBoundingClientRect();
      if (that.options.clone) {
        var clonedEl = that.orgEl.cloneNode(true);
        var css = { opacity: 1, display: "block", position: "absolute", margin: 0,
          backgroundColor: 'pink', height: rect.height+"px", width: rect.width+"px", left: rect.left+"px", top: rect.top+"px"}
        for (var attr in css) { clonedEl.style[attr] = css[attr]; }
        that.el = clonedEl;
        that.el.addEventListener('mouseup',that.end, true);
        document.body.appendChild(clonedEl);
      } else {
        that.el = that.orgEl;
        that.el.style.position ='absolute';
        that.el.style.width = rect.width+'px';
        that.el.style.height = rect.height+'px';
      }

      that.startedWith = { event : event, rect : that.el.getBoundingClientRect() };
      that.orgCssText = that.orgEl.style.cssText;
      if (that.options.start) {
        that.options.start.call(this, event, that.el);
      }
    }
  };
  this.drag =  function(event) {
    if (event.which == 1) {
      var boundaryRect = that.tmpArea.getBoundingClientRect();
      var newLeft = that.startedWith.rect.left + (event.clientX - that.startedWith.event.clientX);
      var newRight = that.startedWith.rect.right + (event.clientX - that.startedWith.event.clientX);
      var newTop  = that.startedWith.rect.top  + (event.clientY - that.startedWith.event.clientY);
      var newBottom  = that.startedWith.rect.bottom  + (event.clientY - that.startedWith.event.clientY);
      if (newLeft > boundaryRect.left && newRight < boundaryRect.right) {
        that.el.style.left  = newLeft+'px';
      }
      if (newTop > boundaryRect.top && newBottom < boundaryRect.bottom) {
        that.el.style.top  = newTop+'px';
      }
      if (that.options.drag) {
        that.options.drag.call(this, event, that.el);
      }
    }
  };
  this.end = function(event) {
    if (that.options.end) {
      that.options.end.call(this, event, that.el);
    }
    if (that.tmpArea) {
      if (that.options.clone) {
        document.body.removeChild( that.el );
      }
      document.body.removeChild( that.tmpArea );
      that.tmpArea = null;
    }
  };
  this.init(element,options);
  return element;
}
