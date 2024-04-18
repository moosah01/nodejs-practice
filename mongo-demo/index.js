const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const { Schema } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "A course should have at least one tag.",
    },
  },
  dateCreated: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  try {
    const course = new Course({
      name: "Angular Course",
      author: "Moosa",
      category: "web", // "web", "mobile", "network
      tags: ["Angular", "frontend"],
      isPublished: true,
      price: 15,
    });
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

async function getCourses() {
  // Comparison Query Operators
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // Logical Query Operators
  // or
  // and

  // const courses = await Course.find({
  //   isPublished: true,
  //   tags: "frontend",
  // })
  //   // //Starts with Mosh
  //   // .find({ author: /^Mosh/ })

  //   // //Ends with Hamedani case insentivie
  //   // .find({ author: /Hamedani$/i })

  //   // //Contains Mosh case insentivie
  //   // .find({ author: /.*Mosh.*/i })
  //   .or({ author: "Mosh" }, { author: "Moosa" })
  //   .limit(10)
  //   .sort({ name: 1 })
  //   .count();
  // console.log(courses);
  try {
    const courseCount = await Course.countDocuments({
      isPublished: true,
      tags: "frontend",
      author: { $in: ["Mosh", "Moosa"] },
    });

    console.log(
      "Total published frontend courses by Mosh or Moosa:",
      courseCount
    );

    const courses = await Course.find({
      isPublished: true,
      tags: "frontend",
      author: { $in: ["Mosh", "Moosa"] },
    })
      .limit(10)
      .sort({ name: 1 });

    console.log(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

// Pagination => Asuming page number starts from 1
async function getCourses2() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ isPublished: true, author: "Mosh" })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
}

async function getCourses1() {
  try {
    const courses = await Course.find({ isPublished: true, tags: "backend" })
      .sort({ name: 1 })
      .select("name author -_id");

    console.log(courses);
  } catch (err) {
    console.log(err.message);
  }
}

async function getCourses2() {
  try {
    const courses = await Course.find({
      isPublished: true,
      tags: { $in: ["frontend", "backend"] },
    })
      .sort("-price")
      .select("name author price -_id");

    console.log(courses);
  } catch (err) {
    console.log(err.message);
  }
}

async function getCourses3() {
  try {
    // const courses = await Course.find({
    //   isPublished: true,
    //   price: { $gte: 10 },
    //   name: /.*by.*/i,
    // });

    const courses = await Course.find({
      isPublished: true,
    })
      .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
      .select("name author price")
      .sort("-price");

    console.log(courses);
  } catch (err) {
    console.log(err.message);
  }
}
async function updateCourse(id) {
  // Approach: Query first
  try {
    const course = await Course.findById(id);
    if (!course) {
      console.log("Course not found");
      return;
    }
    course.isPublished = true;
    course.author = "Moosa Course";
    const result = await course.save();
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function updateCourse2(id) {
  // Approach: Update first
  try {
    const result = await Course.updateOne(
      { _id: id },
      {
        $set: {
          author: "Mosh",
          isPublished: false,
        },
      },
      {
        new: true,
      }
    );
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function updateCourse3(id) {
  // Approach: Update first
  try {
    const result = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          author: "Sexy",
          isPublished: true,
        },
      },
      {
        new: true,
      }
    );
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function removeCourse(id) {
  // Remove Course
  try {
    const result = await Course.deleteOne({ _id: id });
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

createCourse();
