const foodOrder = new Promise((resolve, reject) => {
  resolve("Food is ready!");
});

foodOrder.then((message) => {
  console.log(message);
});
