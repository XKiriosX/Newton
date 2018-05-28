var pstr;
var multiStr = [];
function interpolate(x, f)
{
	var amap = function(v){ return parseFloat(v) },
		x = x.map(amap),
		f = f.map(amap),
		n = Math.min(x.length, f.length),
		a = [];
	for( var i=0; i < n; i++ )
	{
		a[i] = f[0];
		for( var j=1; j<n-i; j++ )
			f[j-1] = parseFloat( ((f[j] - f[j-1]) / (x[j+i] - x[j-1])).toFixed(7) );
	}
	pstr = a[0];
	var	multi = [new Poly(a[0])];
	for(var i=1; i<a.length; i++)
	{
		pstr += " + "+a[i];
		var pairs = [a[i]];
		for(var j=0; j<i; j++)
		{
			pstr += "(x - "+x[j]+")";
			pairs.push([-x[j],1]);
		}
		multi.push(Poly.multiply.apply(undefined, pairs));
	}
	for( var i = multi.length - 1; i >= 0; i-- ) 
	{
		for( var j = multi[i].length - 1; j >= 0; j-- ) 
		{
			if(!multiStr[j])
			{
				multiStr[j*2] = 0;	
				multiStr[j*2+1] = ( (j!=0?" x":"")+(j!=1&&j!=0?"<sup>"+j+"</sup>":"") )+" +";
			} 
			multiStr[j*2] += multi[i].coeff[j];
		};
	};
	for( var i = multiStr.length - 2; i >= 0; i-=2 ) 
	{
		multiStr[i] = parseFloat(multiStr[i].toFixed(7));
		if( multiStr[i+2] < 0 || !multiStr[i+2] ) multiStr[i+1] = multiStr[i+1].replace(/\+\s?$/,'');
	};
	var result = document.querySelector('#result');
	result.innerHTML = '<div>'+pstr + '</div><br /><div>' + multiStr.join('').replace(/([\-\+])/g,' $1 ') + '</div>';
	console.log(multiStr);
	comparision();
}
function Poly(coeff)
{
	this.coeff = !(coeff instanceof Array) ? Array.prototype.slice.call(arguments) : coeff;
	this.length = this.coeff.length;
	this.multiply = function(poly)
	{
		if( !poly ) return this;
		var totalLength = this.coeff.length + poly.coeff.length - 1,
			result = new Array(totalLength);
		for( var i = 0; i < result.length; i++ ) result[i] = 0;
		for( var i = 0; i < this.coeff.length; i++ )
		{
			for( var j = 0; j < poly.coeff.length; j++ )
			{
				result[i+j] += this.coeff[i] * poly.coeff[j];
			}
		}
		return new Poly(result);
	}
}
Poly.multiply = function()
{
	var args = Array.prototype.slice.call(arguments),
		result = undefined;
	for (var i = 0; i < args.length; i++) 
	{
		if( !(args[i] instanceof Poly) ) args[i] = new Poly(args[i]);
		result = args[i].multiply(result);
	};
	return result;
}

function func(x) {
		return Math.log(x + 2) + Math.sqrt(x);
}

function poly(x) {
		return multiStr[0] + (multiStr[2] * x) + (multiStr[4] * Math.pow(x, 2)) + (multiStr[6] * Math.pow(x, 3)) +
				(multiStr[8] * Math.pow(x, 4)) + (multiStr[10] * Math.pow(x, 5)) + (multiStr[12] * Math.pow(x, 6)) +
				(multiStr[14] * Math.pow(x, 7)) + (multiStr[16] * Math.pow(x, 8)) + (multiStr[18] * Math.pow(x, 9)) +
				(multiStr[20] * Math.pow(x, 10));
}

function comparision() {
		for (let i = 0; i < 2.1; i += 0.1) {
			let f = func(i);
			let p = poly(i);
			document.querySelector('.roots').innerHTML += `<div>root: ${Math.abs(i)}; func: ${f}; poly: ${p}; error: ${Math.abs(f - p)}</div>`;
		}
}