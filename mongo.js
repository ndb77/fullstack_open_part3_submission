const mongoose = require("mongoose");

console.log(process.argv.length)

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

if (process.argv.length < 4) {
  const password = process.argv[2];

  const url = `mongodb+srv://fullstack:${password}@cluster0.wgg7h.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
  });

  const Person = mongoose.model("Person", personSchema);

  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");
      Person.find({}).then((result) => {
        console.log('phonebook:')
        result.forEach((persons) => {
          console.log(persons.name,'',persons.number);
        });
        mongoose.connection.close();
      });
    })
    .catch((err) => console.log(err));
} else {
  const password = process.argv[2];
  const name = process.argv[3];
  const phone_number = process.argv[4];

  console.log(process.argv);
  const url = `mongodb+srv://fullstack:${password}@cluster0.wgg7h.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
  });

  const Person = mongoose.model("Person", personSchema);

  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");
      const person = new Person({
        name: `${name}`,
        number: `${phone_number}`,
        date: new Date(),
      });
      return person.save();
    })
    .then(() => {
      console.log(`added ${name}, number: ${phone_number} to phonebok`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
