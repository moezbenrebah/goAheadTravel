const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');

//** Delete Model factory handler
exports.deleteOnce = currentModel => catchAsyncHandler(async (req, res, next) => {
  const doc = await currentModel.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new ErrHandlingClass('No model found with this id to delete', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//** Update Model factory handler
exports.updateOnce = currentModel => catchAsyncHandler(async (req, res, next) => {
  const doc = await currentModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new ErrHandlingClass('No model found with this id to update', 404))
  }

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

//** Update Model factory handler
exports.addOnce = currentModel => catchAsyncHandler(async (req, res, next) => {
  const doc = await currentModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

//** Get travel and populate the user name
exports.getOnce = (currentModel, pop) => catchAsyncHandler(async (req, res, next) => {
  let query = currentModel.findById(req.params.id);
  if (pop) query = query.populate(pop);
  const doc = await query;

  if (!doc) {
    return next(new ErrHandlingClass('No model found with this id to update', 404))
  }

  res.status(200).json({
    status: 'success',
    data: doc
  });
});
