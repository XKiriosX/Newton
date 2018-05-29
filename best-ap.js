var abs = Math.abs;

function array_fill(i, n, v) {
    var a = [];
    for (; i < n; i++) {
        a.push(v);
    }
    return a;
}



function gauss(A, x) {

    var i, k, j;

    // Just make a single matrix
    for (i=0; i < A.length; i++) {
        A[i].push(x[i]);
    }
    var n = A.length;

    for (i=0; i < n; i++) {
        // Search for maximum in this column
        var maxEl = abs(A[i][i]),
            maxRow = i;
        for (k=i+1; k < n; k++) {
            if (abs(A[k][i]) > maxEl) {
                maxEl = abs(A[k][i]);
                maxRow = k;
            }
        }


        // Swap maximum row with current row (column by column)
        for (k=i; k < n+1; k++) {
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (k=i+1; k < n; k++) {
            var c = -A[k][i]/A[i][i];
            for (j=i; j < n+1; j++) {
                if (i===j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    x = array_fill(0, n, 0);
    for (i=n-1; i > -1; i--) {
        x[i] = A[i][n]/A[i][i];
        for (k=i-1; k > -1; k--) {
            A[k][n] -= A[k][i] * x[i];
        }
    }

    return x;
}

function best_ap() {
    let A = [[2,2], [2,2.67]];
    let xs = [4.0445, 4.649];
    let ans = gauss(A, xs);
    function appr_polynom(x) {
        return ans[0] + ans[1] * x;
    }
    function func(x) {
        return Math.log(x + 2) + Math.sqrt(x);
    }
    for (let i = 0; i < 2.1; i += 0.1) {
        let appr = appr_polynom(i);
        let f = func(i);
        document.querySelector('.bap').innerHTML += `<div>root: ${Math.abs(i)}; func: ${f}; Approximation: ${appr}; error: ${Math.abs(f - appr)}</div>`;
    }
}