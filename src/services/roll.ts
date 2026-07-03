import RandomOrg from 'random-org';

export async function rollDice(amount: number, type: number) {
  const random = new RandomOrg({apiKey: process.env.RANDOM_KEY!})
  let results;
  await random.generateIntegers({ min: 1, max: type, n: amount }).then(function (result) {
    results={"all values": result.random.data, "sum": result.random.data.reduce((acc, last)=>acc+last)}
  })
  return results;
}
