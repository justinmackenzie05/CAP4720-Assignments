	function mandelIter( cx, cy, maxIter ) 
	{
		var x = 0.0;
		var y = 0.0;
		var xx = 0;
		var yy = 0;
		var xy = 0;
 
		var i = maxIter;
		while (i-- && xx + yy <= 4) 
		{
			xy = x * y;
			xx = x * x;
			yy = y * y;
			x = xx - yy + cx;
			y = xy + xy + cy;
		}
		return maxIter - i;
	}
 
	function mandelbrot( pixeldata, width, height ) 
	{
		var xmin = -2;
		var xmax = 1;
		var ymin = -1;
		var ymax = 1;
		var iterations = 1000;
 
		for (var ix = 0; ix < width; ++ix) 
		{
			for (var iy = 0; iy < height; ++iy) 
			{
				var x = xmin + (xmax - xmin) * ix / (width - 1);
				var y = ymin + (ymax - ymin) * iy / (height - 1);
				var i = mandelIter(x, y, iterations);
				var ppos = 3 * (width * iy + ix);
 
				if (i > iterations) 
				{
					pixeldata[ppos] = 0;
					pixeldata[ppos + 1] = 0;
					pixeldata[ppos + 2] = 0;
				} 
				else 
				{
					var c = 3 * Math.log(i) / Math.log(iterations - 1.0);
 
					if (c < 1) 
					{
						pixeldata[ppos] = 255 * c;
						pixeldata[ppos + 1] = 0;
						pixeldata[ppos + 2] = 0;
					}
					else if ( c < 2 ) 
					{
						pixeldata[ppos] = 255;
						pixeldata[ppos + 1] = 255 * (c - 1);
						pixeldata[ppos + 2] = 0;
					} 
					else 
					{
						pixeldata[ppos] = 255;
						pixeldata[ppos + 1] = 255;
						pixeldata[ppos + 2] = 255 * (c - 2);
					}
				}
				pixeldata[ppos + 3] = 255;
			}
		}
 
	}
