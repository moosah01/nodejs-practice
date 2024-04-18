const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const { Schema } = mongoose;

const courseSchema = new Schema({
  name: String,
  tags: [String],
  dateCreated: { type: Date, default: Date.now },
  author: String,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

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

// updateCourse2("6620fb86f7d0518ba795e833");
// updateCourse3("6620fb86f7d0518ba795e833");

removeCourse("6620fb86f7d0518ba795e833");
