var names = [
  "Matt Maribojoc",
  "Lebron James",
  "Bill Gates",
  "Childish Bambino",
];
const getPosts = (number) => {
  let ret = [];
  for (var i = 0; i < number; i++) {
    ret.push({
      author: names[i % names.length],
      content: "Lorrem isspum dslor sdit emetm, consector sjdf nug, fod",
    });
  }
  return ret
};

export default getPosts;
