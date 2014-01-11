/**
 * Vanilla Javascript Draggable
 * 
 * Usage: 
 *    new Draggable(element, options);
 * 
 * element:
 *  element to drag
 * 
 * options
 *  boundary : element (default, document.body)
 *  clone: true or false, indicates drag cloned element or not (default, false)
 *  start : callback function on drag starts
 *        parameters: evnet, _this.orgEl
 *  drag : callback function on drag
 *        parameters: event, _this.orgEl, move
 *  end : callback function on drag end
 *        parameters: event, _this.orgEl
 */
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
  var _this = this;
  this.start = function(event) {
    event.preventDefault(); //prevent from selecting html
    if (!_this.tmpArea) {
      // setup dragging Area
      var boundaryRect = _this.options.boundary.getBoundingClientRect();
      var tmpArea = document.createElement('div');
      var scrollTop  = (document.all ? document.body.scrollTop : window.pageYOffset);
      var scrollLeft = (document.all ? document.body.scrollLeft : window.pageXOffset);
      tmpArea.style.cssText = "position:absolute; border: 0px dotted black; "+
        "width:"+boundaryRect.width+"px; height:"+boundaryRect.height+"px; "+
        "top:"+(scrollTop+boundaryRect.top)+"px; "+
        "left:"+(scrollLeft+boundaryRect.left)+"px";
      document.body.appendChild(tmpArea);
      tmpArea.addEventListener('mousemove',_this.drag, false);
      tmpArea.addEventListener('mouseup',_this.end, true);
      _this.tmpArea = tmpArea;

      // setup dragging object
      var rect = _this.orgEl.getBoundingClientRect();
      if (_this.options.clone) {
        var clonedEl = _this.orgEl.cloneNode(true);
        var css = { opacity: 1, display: "block", position: "absolute", margin: 0,
          height: rect.height+"px", width: rect.width+"px", 
          left: (scrollLeft+rect.left)+"px",
          top: (scrollTop+rect.top)+"px"
        }
        for (var attr in css) { clonedEl.style[attr] = css[attr]; }
        _this.el = clonedEl;
        _this.el.addEventListener('mouseup',_this.end, true);
        document.body.appendChild(clonedEl);
      } else {
        _this.el = _this.orgEl;
        _this.el.style.position ='absolute';
        _this.el.style.width = rect.width+'px';
        _this.el.style.height = rect.height+'px';
      }

      _this.startedWith = { event : event, rect : _this.el.getBoundingClientRect() };
      _this.orgCssText = _this.orgEl.style.cssText;
      if (_this.options.start) {
        _this.options.start.call(this, event, _this.orgEl);
      }
    }
  };
  this.drag =  function(event) {
    var scrollTop  = (document.all ? document.body.scrollTop : window.pageYOffset);
    var scrollLeft = (document.all ? document.body.scrollLeft : window.pageXOffset);
    if (event.which == 1) {
      var distance = {
        x: (event.clientX - _this.startedWith.event.clientX),
        y: (event.clientY - _this.startedWith.event.clientY)
      };
      var move = {x: 0, y: 0 };
      var newLeft = _this.startedWith.rect.left + distance.x;
      var newRight = _this.startedWith.rect.right + distance.x;
      var newTop  = _this.startedWith.rect.top  + distance.y ;
      var newBottom  = _this.startedWith.rect.bottom  + distance.y;

      var boundaryRect = _this.tmpArea.getBoundingClientRect();
      if (newLeft > boundaryRect.left && newRight < boundaryRect.right) {
        _this.el.style.left  = (scrollLeft + newLeft)+'px';
        move.x = distance.x;
      }
      if (newTop > boundaryRect.top && newBottom < boundaryRect.bottom) {
        _this.el.style.top  = (scrollTop + newTop)+'px';
        move.y = distance.y;
      }
      if (_this.options.drag) {
        _this.options.drag.call(this, event, _this.orgEl, move);
      }
    }
  };
  this.end = function(event) {
    if (_this.options.end) {
      _this.options.end.call(this, event, _this.orgEl);
    }
    if (_this.tmpArea) {
      if (_this.options.clone) {
        document.body.removeChild( _this.el );
      }
      document.body.removeChild( _this.tmpArea );
      _this.tmpArea = null;
    }
  };
  this.init(element,options);
  return element;
}
