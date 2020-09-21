function getDistanceNearestOnes(matrix) {
  var matrixCopy = JSON.parse(JSON.stringify(matrix));
  matrixCopy.map(x => x[0] = "0");
  matrixCopy = matrixCopy.map(x => x.map(y => Number(y)));

  var result = [];
  var index = 0;
  const updateUsedColumn = (row) => { row[index] = 0 }

  for (let i = 0; i < matrixCopy.length - 1; i++) {
    const min = Math.min(...matrixCopy[index].filter(Number));
    result.push(min);
    index = matrixCopy[index].indexOf(min);
    matrixCopy.map(x => updateUsedColumn(x));
  }

  result.push(Number(matrix[index][0]));

  return result;
}

export default getDistanceNearestOnes;