const foodOrder = new Promise((resolve, reject) => {
  resolve("Food is ready!");
});

async function getFood() {
  const message = await foodOrder;
  console.log(message);
}

getFood();
