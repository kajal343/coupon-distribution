const bcrypt = require('bcryptjs');

const password = "bG9JuApcZxbVspN"; // Replace with your actual admin password

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hashedPassword);
  }
});
