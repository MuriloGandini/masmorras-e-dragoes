import RandomOrg from 'random-org';

export async function rollDice(dice: string[]) {
  const random = new RandomOrg({apiKey: process.env.RANDOM_KEY!})
  let dadoStr: string[] = dice;
  let dado: number[] = [];
  dadoStr.forEach((dice) => {
    dado.push(parseInt(dice));
  });
  let results;
  await random.generateIntegers({ min: 1, max: dado[1]!, n: dado[0]! }).then(function (result) {
    results={"all values": result.random.data, "sum": result.random.data.reduce((acc, last)=>acc+last)}
  })
  return results;
}
