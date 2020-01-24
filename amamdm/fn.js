// Group by color as key to the person array
    this.currentMdmData = this.groupBy(
      Array.prototype.slice.call(this.currentMdmData, 0),
      "level"
    );
	
	// Accepts the array and key
  groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      //console.log("cccc", currentValue);
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );

      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };