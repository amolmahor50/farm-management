const KnowledgeContent = require('../models/KnowledgeContent');

exports.getAllContent = async (req, res, next) => {
  try {
    const { category, contentType, language, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };
    if (category) query.category = category;
    if (contentType) query.contentType = contentType;
    if (language) query.language = language;

    const content = await KnowledgeContent.find(query)
      .sort({ isFeatured: -1, views: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await KnowledgeContent.countDocuments(query);

    res.status(200).json({
      success: true,
      data: content,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

exports.getContent = async (req, res, next) => {
  try {
    const content = await KnowledgeContent.findById(req.params.id)
      .populate('author', 'name profileImage')
      .populate('relatedContent', 'title contentType category');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    content.views += 1;
    await content.save();

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    next(error);
  }
};

exports.createContent = async (req, res, next) => {
  try {
    const content = await KnowledgeContent.create({
      author: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    next(error);
  }
};

exports.likeContent = async (req, res, next) => {
  try {
    const content = await KnowledgeContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    const index = content.likes.indexOf(req.user.id);

    if (index > -1) {
      content.likes.splice(index, 1);
      content.likesCount -= 1;
    } else {
      content.likes.push(req.user.id);
      content.likesCount += 1;
    }

    await content.save();

    res.status(200).json({
      success: true,
      data: { likesCount: content.likesCount }
    });
  } catch (error) {
    next(error);
  }
};

exports.bookmarkContent = async (req, res, next) => {
  try {
    const content = await KnowledgeContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    const index = content.bookmarks.indexOf(req.user.id);

    if (index > -1) {
      content.bookmarks.splice(index, 1);
    } else {
      content.bookmarks.push(req.user.id);
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark toggled'
    });
  } catch (error) {
    next(error);
  }
};
