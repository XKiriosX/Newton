//var spline = require('cubic-spline');

/*var xs = [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2];
var ys = [0.693, 1.235, 1.508, 1.7301, 1.92405, 2.0986, 2.2586, 2.407, 2.54584, 2.67664, 2.80051];*/
var xs = [];
var ys = [];

function func(x) {
    return Math.log(x + 2) + Math.sqrt(x);
}

function init(xss, yss) {
    let amap = function (val) {
        return parseFloat(val);
    };
    xs = xss.map(amap);
    ys = yss.map(amap);
    for (let i = 0; i < 2; i+=0.1) {
        let a = spline(i, xs, ys);
        let f = func(i);
        document.querySelector('.spline-roots').innerHTML += `<div>root: ${Math.abs(i)}; func: ${f}; Spline: ${a}; error: ${Math.abs(f - a)}</div>`;
    }
}
function spline(x, xs, ys) {
    var ks = xs.map(function(){return 0})
    ks = getNaturalKs(xs, ys, ks)
    var i = 1;
    while(xs[i]<x) i++;
    var t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
    var a =  ks[i-1]*(xs[i]-xs[i-1]) - (ys[i]-ys[i-1]);
    var b = -ks[i]*(xs[i]-xs[i-1]) + (ys[i]-ys[i-1]);
    var q = (1-t)*ys[i-1] + t*ys[i] + t*(1-t)*(a*(1-t)+b*t);
    return q;
}

function getNaturalKs (xs, ys, ks) {
    var n = xs.length-1;
    var A = zerosMat(n+1, n+2);

    for(var i=1; i<n; i++)
    {
        A[i][i-1] = 1/(xs[i] - xs[i-1]);
        A[i][i] = 2 * (1/(xs[i] - xs[i-1]) + 1/(xs[i+1] - xs[i])) ;
        A[i][i+1] = 1/(xs[i+1] - xs[i]);
        A[i][n+1] = 3*( (ys[i]-ys[i-1])/((xs[i] - xs[i-1])*(xs[i] - xs[i-1]))  +  (ys[i+1]-ys[i])/ ((xs[i+1] - xs[i])*(xs[i+1] - xs[i])) );
    }

    A[0][0] = 2/(xs[1] - xs[0]);
    A[0][1] = 1/(xs[1] - xs[0]);
    A[0][n+1] = 3 * (ys[1] - ys[0]) / ((xs[1]-xs[0])*(xs[1]-xs[0]));

    A[n][n-1] = 1/(xs[n] - xs[n-1]);
    A[n][n] = 2/(xs[n] - xs[n-1]);
    A[n][n+1] = 3 * (ys[n] - ys[n-1]) / ((xs[n]-xs[n-1])*(xs[n]-xs[n-1]));

    return solve(A, ks);
}


function solve (A, ks) {
    let j;
    let i;
    let m = A.length;
    for(let k=0; k<m; k++)
    {
        let i_max = 0;
        let vali = Number.NEGATIVE_INFINITY;
        for(i = k; i<m; i++) {
            if(A[i][k]>vali) {
                i_max = i;
                vali = A[i][k];
            }
        }
        swapRows(A, k, i_max);

        for(i = k+1; i<m; i++)
        {
            for(j = k+1; j<m+1; j++)
                A[i][j] = A[i][j] - A[k][j] * (A[i][k] / A[k][k]);
            A[i][k] = 0;
        }
    }
    for(i = m-1; i>=0; i--) // rows = columns
    {
        let v = A[i][m] / A[i][i];
        ks[i] = v;
        for(j = i-1; j>=0; j--) // rows
        {
            A[j][m] -= A[j][i] * v;
            A[j][i] = 0;
        }
    }
    return ks;
}

function zerosMat (r,c) {
    let A = [];
    for(let i=0; i<r; i++) {
        A.push([]);
        for(let j=0; j<c; j++) {
            A[i].push(0);
        }
    }
    return A;
}

function swapRows (m, k, l) {
    let p = m[k];
    m[k] = m[l];
    m[l] = p;
}