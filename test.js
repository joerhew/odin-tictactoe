// eslint-disable-next-line arrow-body-style
const areArrayElementsEqualWithReturn = (arr) => {
    return arr.every((marker) => (marker !== undefined && marker === arr[0])); // return
  };

const areArrayElementsEqualWithoutReturn = (arr) => {
    arr.every((marker) => (marker !== undefined && marker === arr[0])); // return omitted
  };

function areArrayElementsEqualWithoutReturnNonArrow(arr) {
    arr.every((marker) => (marker !== undefined && marker === arr[0])); // non-arrow without return
}

function areArrayElementsEqualWithoutReturnNonArrowWithReturn(arr) {
    return arr.every((marker) => (marker !== undefined && marker === arr[0])); // non-arrow return
}

const array = ['X','X','X'];

areArrayElementsEqualWithReturn(array); // returns true
areArrayElementsEqualWithoutReturn(array); // returns undefined. Why?
areArrayElementsEqualWithoutReturnNonArrow(array);
areArrayElementsEqualWithoutReturnNonArrowWithReturn(array);