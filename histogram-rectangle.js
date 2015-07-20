require.config({
	paths: {
		jquery: 'node_modules/jquery/dist/jquery',
		css: 'node_modules/require-css/css'
	}
});
require(['jquery', 'histogram'], function ($, Hist) {
	var h = new Hist({
		data: [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1],
		el: $("<div>").appendTo(document.body)
	});
	var $mr;
	$(h.el).mousemove(function (e) {
		var coords = h.coordsScreen2Data(e.pageX, e.pageY);
		h.data[coords.index] = coords.value;
		h.draw(coords.index);
	});
	$(h).on('after-draw', function () {
		var mac, ma = 0, maxrect;
		var rectReport = h.findRectangles();
		$.each(rectReport.rectangles, function (i, rect) {
			mac = (rect.max - rect.min) * rect.height;
			if (ma < mac) {
				ma = mac;
				maxrect = rect;
			}
		});
		$mr = h.drawRectangle(maxrect, 'spanning-rectangle', "largest area: " + Math.round(100 * ma) / 100 + "<br />" + rectReport.compares + " compares<br /><small>(" + h.data.length + " items)</small>", $mr).addClass('max-rectangle');
	});
	h.draw();
});