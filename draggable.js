var Draggable = function(element, options) {
  if (typeof element == 'string' || element instanceof String) {
    element = document.querySelector(element);
  }
  this.orgEl = element;    // original clicked element 
  this.orgCssText = null;  // original style css text
  this.el = null;          // element to be dragged. original or cloned one
  this.tmpArea = null;     // when drag starts, create a temporary dragging area so that mouse can move around
  this.startedWith = null; // status of when drag starts
  this.options = null;
  this.init = function(element, options) {
    options = options || {}
    options.boundary = options.boundary || document.body;
    this.options = options;
    element.addEventListener("mousedown", this.start, false);
  };
  var self = this;
  this.start = function(event) {
    event.preventDefault(); //prevent from selecting html
    if (!self.tmpArea) {
      // setup dragging Area
      var boundaryRect = self.options.boundary.getBoundingClientRect();
      var tmpArea = document.createElement('div');
      var scrollTop  = (document.all ? document.body.scrollTop : window.pageYOffset);
      var scrollLeft = (document.all ? document.body.scrollLeft : window.pageXOffset);
      tmpArea.style.cssText = "position:absolute; border: 0px dotted black; "+
        "width:"+boundaryRect.width+"px; height:"+boundaryRect.height+"px; "+
        "top:"+(scrollTop+boundaryRect.top)+"px; "+
        "left:"+(scrollLeft+boundaryRect.left)+"px";
      document.body.appendChild(tmpArea);
      tmpArea.addEventListener('mousemove',self.drag, false);
      tmpArea.addEventListener('mouseup',self.end, true);
      self.tmpArea = tmpArea;

      // setup dragging object
      var rect = self.orgEl.getBoundingClientRect();
      if (self.options.clone) {
        var clonedEl = self.orgEl.cloneNode(true);
        var css = { opacity: 1, display: "block", position: "absolute", margin: 0,
          height: rect.height+"px", width: rect.width+"px", 
          left: (scrollLeft+rect.left)+"px",
          top: (scrollTop+rect.top)+"px"
        }
        for (var attr in css) { clonedEl.style[attr] = css[attr]; }
        self.el = clonedEl;
        self.el.addEventListener('mouseup',self.end, true);
        document.body.appendChild(clonedEl);
      } else {
        self.el = self.orgEl;
        self.el.style.position ='absolute';
        self.el.style.width = rect.width+'px';
        self.el.style.height = rect.height+'px';
      }

      self.startedWith = { event : event, rect : self.el.getBoundingClientRect() };
      self.orgCssText = self.orgEl.style.cssText;
      if (self.options.start) {
        self.options.start.call(this, event, self.orgEl);
      }
    }
  };
  this.drag =  function(event) {
    var scrollTop  = (document.all ? document.body.scrollTop : window.pageYOffset);
    var scrollLeft = (document.all ? document.body.scrollLeft : window.pageXOffset);
    if (event.which == 1) {
      var distance = {
        x: (event.clientX - self.startedWith.event.clientX),
        y: (event.clientY - self.startedWith.event.clientY)
      };
      var move = {x: 0, y: 0 };
      var newLeft = self.startedWith.rect.left + distance.x;
      var newRight = self.startedWith.rect.right + distance.x;
      var newTop  = self.startedWith.rect.top  + distance.y ;
      var newBottom  = self.startedWith.rect.bottom  + distance.y;

      var boundaryRect = self.tmpArea.getBoundingClientRect();
      if (newLeft > boundaryRect.left && newRight < boundaryRect.right) {
        self.el.style.left  = (scrollLeft + newLeft)+'px';
        move.x = distance.x;
      }
      if (newTop > boundaryRect.top && newBottom < boundaryRect.bottom) {
        self.el.style.top  = (scrollTop + newTop)+'px';
        move.y = distance.y;
      }
      if (self.options.drag) {
        self.options.drag.call(this, event, self.orgEl, move);
      }
    }
  };
  this.end = function(event) {
    if (self.options.end) {
      self.options.end.call(this, event, self.orgEl);
    }
    if (self.tmpArea) {
      if (self.options.clone) {
        document.body.removeChild( self.el );
      }
      document.body.removeChild( self.tmpArea );
      self.tmpArea = null;
    }
  };
  this.init(element,options);
  return element;
}
