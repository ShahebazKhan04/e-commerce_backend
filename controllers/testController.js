export const getTestController = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "test Routes",
  });
};
