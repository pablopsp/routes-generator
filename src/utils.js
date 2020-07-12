function clearMatrix(matrix) {
    matrix = matrix.map(row => row.map(distance => distance.replace(',', ".").replace('km', "").replace(' ', "")));
    matrix = matrix.map(row => row.flatMap(distance => distance === "1m" ? "0" : distance));

    return matrix;
}

export default clearMatrix;