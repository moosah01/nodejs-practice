const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: {
      type: [authorSchema],
      required: true,
    },
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.findById(courseId);
  course.author.name = "Moosa";
  course.save();
}

async function updateAuthor2(courseId) {
  const course = await Course.findByIdAndUpdate(
    { _id: courseId },
    {
      $set: {
        "author.name": "John Smith",
      },
    },
    {
      new: true,
    }
  );
  console.log(course);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  try {
    const result = await Course.findOneAndUpdate(
      { _id: courseId },
      { $pull: { authors: { _id: authorId } } },
      { new: true }
    );

    if (!result) {
      console.log("Course not found");
      return;
    }

    console.log("Author removed from the course:", result);
  } catch (err) {
    console.error("Error removing author:", err.message);
  }
}

async function removeAuthorWithTransaction(courseId, authorId) {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    const options = { session }; // Pass the session to the operations

    // 1. Find the course by its ID
    const course = await Course.findOne({ _id: courseId }, null, options);

    if (!course) {
      throw new Error("Course not found");
    }

    // 2. Remove the author from the authors array
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $pull: { authors: { _id: authorId } } },
      { new: true, session } // Use the session in the update operation
    );

    if (!updatedCourse) {
      throw new Error("Course not found"); // Handle the case where the course doesn't exist
    }

    // Commit the transaction
    await session.commitTransaction();
    console.log("Author removed from the course:", updatedCourse);
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    console.error("Error removing author:", error.message);
  } finally {
    // End the session
    session.endSession();
  }
}

async function removeAuthorWithTransaction2(courseId, authorId) {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    const options = { session }; // Pass the session to the operations

    // 1. Find the course by its ID and select only the 'name' field
    const course = await Course.findOne({ _id: courseId })
      .select("name")
      .session(session);

    if (!course) {
      throw new Error("Course not found");
    }

    // 2. Remove the author from the authors array
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $pull: { authors: { _id: authorId } } },
      { new: true, session } // Use the session in the update operation
    );

    if (!updatedCourse) {
      throw new Error("Course not found"); // Handle the case where the course doesn't exist
    }

    // Commit the transaction
    await session.commitTransaction();
    console.log("Author removed from the course:", updatedCourse);
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    console.error("Error removing author:", error.message);
  } finally {
    // End the session
    session.endSession();
  }
}

// Call the function to remove the author with transaction
removeAuthorWithTransaction(
  "662172361c77f1c24ce3da64",
  "662172361c77f1c24ce3da66"
);

// createCourse("Node Course", [{ name: "Moosa" }, { name: "John" }]);
// addAuthor("662172361c77f1c24ce3da64", { name: "Maryam" });
// removeAuthor("662172361c77f1c24ce3da64", "662172862d3d0ccf668d3f0c");

// updateAuthor("662170d040d1d77b16dd82e7");
// updateAuthor2("662170d040d1d77b16dd82e7");
