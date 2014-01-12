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
  this.el = null;          // element to be dragged. original or cloned one
  this.tmpArea = null;     // when drag starts, create a temporary dragging area so that mouse can move around
  this.startedWith = null; // status of when drag starts
  this.options = null;
  
  var createOverlay = function(el, options) {
    var elBCR = el.getBoundingClientRect();
    var overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.width = elBCR.width +'px';
    overlay.style.height= elBCR.height+'px';
    overlay.style.zIndex = 100;
    for (var key in (options||{})) {
      overlay.style[key] = options[key];
    }
    el.parentElement.insertBefore(overlay, el);
    return overlay;
  }

  var _this = this;
  
  this.start = function(event) {
    event.preventDefault(); //prevent from selecting html
    if (!_this.tmpArea) {
      // setup dragging Area
      if (_this.options.boundary) {
        _this.tmpArea = createOverlay(_this.options.boundary);
      } else {
        _this.tmpArea = document.body;
      }
      _this.tmpArea.addEventListener('mousemove',_this.drag, false);
      _this.tmpArea.addEventListener('mouseup',_this.end, true);

      // setup dragging object
      var rect = _this.orgEl.getBoundingClientRect();
      var scrollTop  = (document.all ? document.body.scrollTop : window.pageYOffset);
      var scrollLeft = (document.all ? document.body.scrollLeft : window.pageXOffset);
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
      var move = {};
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
    _this.tmpArea.removeEventListener('mousemove', _this.drag, false);
    _this.tmpArea.removeEventListener('mouseup', _this.end, true);
    if (_this.tmpArea) {
      if (_this.options.clone) {
        document.body.removeChild( _this.el );
      }
      if (_this.options.boundary) {
        document.body.removeChild( _this.tmpArea );
      }
      _this.tmpArea = null;
    }
  };
  
  this.options = options||{};
  element.addEventListener("mousedown", this.start, false);
}
