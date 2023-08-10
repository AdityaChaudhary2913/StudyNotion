const Category=require("../models/Category");

//Tag handler function
exports.createCategory = async (req, res) => {
  try{
    //Fetch data
    const {name, description}=req.body;

    //Validations
    if(!name || !description){
      return res.status(400).json({
        success:false,
        message:"Please provide every detail for the tag"
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
    res.status(500).json({
      success:false,
      message:"Error while creating tag!"
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
			.populate("courses")
			.exec();
		//validation
		if (!selectedCategory) {
			return res.status(404).json({
				success: false,
				message: "Data Not Found",
			});
		}
		//get courses for different categories
		const differentCategories = await Category.find({
			_id: { $ne: categoryId },
		})
			.populate("courses")
			.exec();

		//get top 10 selling courses
		//HW - write it on your own

		//return response
		return res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategories,
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