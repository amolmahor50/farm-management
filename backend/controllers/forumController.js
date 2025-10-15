const ForumPost = require('../models/ForumPost');

exports.getAllPosts = async (req, res, next) => {
  try {
    const { category, tags, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };

    const posts = await ForumPost.find(query)
      .populate('author', 'name profileImage')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ForumPost.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name profileImage')
      .populate('comments.author', 'name profileImage');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await ForumPost.create({
      author: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      author: req.user.id,
      content: req.body.content
    });

    post.commentsCount += 1;
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const index = post.likes.indexOf(req.user.id);

    if (index > -1) {
      post.likes.splice(index, 1);
      post.likesCount -= 1;
    } else {
      post.likes.push(req.user.id);
      post.likesCount += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post like toggled',
      data: { likesCount: post.likesCount }
    });
  } catch (error) {
    next(error);
  }
};
