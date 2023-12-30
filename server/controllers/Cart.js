const Cart = require("../models/Cart")


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.body
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      const newCart = new Cart({
        user: userId,
        courses: [courseId]
      })
      await newCart.save()
      return res.status(200).json({
        success: true,
        message: "Course Added To Cart"
      })
    }
    const courses = cart.courses
    courses.push(courseId)
    cart.courses = courses
    await cart.save()
    return res.status(200).json({
      success: true,
      message: "Course Added To Cart"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Could Not Add Course To Cart"
    })
  }
}

exports.removeFromCart = async (req, res) => {
  const userId = req.user.id
  const { courseId } = req.body
  try {
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "No Cart Found"
      })
    }
    const courses = cart.courses
    const index = courses.indexOf(courseId)
    if (index > -1) {
      courses.splice(index, 1)
    }
    cart.courses = courses
    await cart.save()
    return res.status(200).json({
      success: true,
      message: "Course Removed From Cart"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Could Not Remove Course From Cart"
    })
  }
}