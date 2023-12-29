const Category=require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

//Tag handler function
exports.createCategory = async (req, res) => {
  try{
    //Fetch data
    const {name, description}=req.body;

    //Validations
    if(!name || !description){
      return res.status(400).json({
        success:false,
        message:"Please provide every detail"
      });
    }
    //Create entry in Database
    const categoryDetail=await Category.create({
      name:name,
      description:description,
    })
    
    //Returning response
    return res.status(201).json({
      success:true,
      message:"Category created successfully",
    });

  } catch(err){
    return res.status(500).json({
      success:false,
      message:"Error while creating category!"
    })
  }
}

//GetAll tag handler function
exports.showAllCategory = async (req, res) => {
  try{
    const allTags=await Category.find({}, {name:true, description:true});
    return res.status(200).json({
      success:true,
      message:"All Categories fetched successfully",
      data:allTags
    });
  
  } catch(err){
    res.status(500).json({
      success:false,
      message:"Error while fetching Categories!"
    });
  }
}

exports.categoryPageDetails = async (req, res) => {
  try {
		//get categoryId
		const { categoryId } = req.body;
		//get courses for specified categoryId
		const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: ["ratingAndReviews", "instructor"],
      })
      .exec()
		//validation
		if (!selectedCategory) {
			return res.status(404).json({
				success: false,
				message: "Data Not Found",
			});
		}

    if (selectedCategory.courses.length === 0) {
      console.log("No course for this selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses for this category.",
      })
    }

		//get courses for different categories
		const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "instructor"
      })
      .exec()
    console.log()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "instructor"
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

		//return response
		return res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategory,
        mostSellingCourses,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}