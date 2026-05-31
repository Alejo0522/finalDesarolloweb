const Review = require('../models/review.model');

exports.createReview = async (req, res) => {
    try {
        const { restaurantName, rating, visitDate, observations } = req.body;

        const newReview = new Review({
            restaurantName,
            rating,
            visitDate,
            observations,
            user: req.user
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);

    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'username');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) return res.status(404).json({ message: 'No encontrado' });

        if (review.user.toString() !== req.user) {
            return res.status(403).json({ message: 'No tienes permisos' });
        }

        review = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) return res.status(404).json({ message: 'No encontrado' });

        if (review.user.toString() !== req.user) {
            return res.status(403).json({ message: 'No tienes permisos' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Eliminada' });

    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};
