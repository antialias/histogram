define(['jquery', 'css!histogram'], function ($) {
	var Histogram = function () {
		var histogram = this;
		this.data = arguments[0].data;
		this.el = arguments[0].el;
		this.histobars = Array(this.data.length);
		this.dataMin = Math.min.apply(undefined, this.data);
		this.dataMax = Math.max.apply(undefined, this.data);
	};
	var hmarginPct = 0.5;
	
	Histogram.prototype.coordsScreen2Data = function (x,y) {
		var off = this.el.offset();
		var index = Math.floor(this.data.length * (x - off.left) / this.el.width());
		var value = this.dataMax * (this.el.height() - y + off.top) / this.el.height();
		return {index: index, value: value};
	};
	Histogram.prototype.draw = function (drawIndex) {
		var histogram = this;
		$(histogram.el).addClass('histogram');
		$.each(this.data, function (i, d) {
			if (!drawIndex || i === drawIndex) {
				var histobar = histogram.histobars[i];
				histogram.histobars[i] = histogram.drawRectangle({min: i, max: i+1, height: d}, "histobar", Math.round(10*d) / 10, histobar);
				
			}
		});
		$(this).trigger('after-draw');
	};
	Histogram.prototype.drawRectangle = function (rect, classname, label, $hb) {
		var max = this.dataMax;
		var histogram = this;
		if (undefined === $hb) {
			$hb = $("<div>").addClass('histobar').addClass(classname).appendTo(histogram.el);
		}
		if (label) {
			$hb.find('.label').remove();
			$hb.append($("<div>").addClass('label').html(label));
		}
		$hb.css({
			marginRight: (rect.max < histogram.data.length - 1) ? "" + hmarginPct + "%" : 0,
			height: "" + (100 * rect.height / max) + "%",
			width: "" + ((100 * (rect.max - rect.min) - hmarginPct * (histogram.data.length - 1)) / histogram.data.length) + "%",
			left: "" + (100 * rect.min / histogram.data.length) + "%",
			bottom: 0
		});
		return $hb;
	};
	Histogram.prototype.findRectangles = function () {
		var compareCount = 0;
		var d = this.data.slice(0),
			rectangles = [],
			s = [{h:0, i:0}],
			i,
			p,
			ac,rc,mr,
			ma=0;
		d.push(0);
		for (i = 0; i < d.length; ++i) {
			p = s[s.length - 1];
			// console.log("i = ", i);
			// console.log("stack is", s);
			// console.log("s = ", s);
			// console.log("d[i]:", d[i]);
			++compareCount;
			if (!p || d[i] > p.h) {
				// console.log("pushing", {h:d[i], i:i});
				s.push({h:d[i], i:i});
				continue;
			}
			++compareCount;
			if (d[i] === p.h) {
				// console.log("maintaining");
				continue;
			}
			++compareCount;
			while(s[s.length-1].h > d[i]) {
				p = s.pop();
				// console.log("stack is", s);
				if (!p) {
					break;
				}
				// console.log("popped ", p);
				rc = {min: p.i, max: i, height: p.h};
				ac = (i-p.i) * p.h;
				rectangles.push(rc);
				// console.log("a valid rectangle:", rc, "area ", ac);
				++compareCount;
				if (ac > ma) {
					ma = ac;
					mr = rc;
				}
			}
			if (!p) {
				continue;
			}
			// console.log("set top element to ", {h:d[i], i:p.i});
			s.push({h:d[i], i:p.i});
		}
		return {rectangles: rectangles, compares: compareCount};
	}
	return Histogram;
});