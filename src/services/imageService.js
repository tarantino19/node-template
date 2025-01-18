const Image = require('../models/Image');

const imageService = {
	createImage: async (req, res) => {
		try {
			const image = new Image(req.body);
			await image.save();
			res.status(201).json(image);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	uploadImage: async (req, res) => {
		const { imageUrl, albumId, description, tags } = req.body;
		const userId = req.user._id;

		if (!imageUrl || !albumId || !userId) {
			return res.status(400).json({ error: 'Unable to upload image' });
		}

		try {
			const cloudinaryResult = await cloudinary.uploader.upload(imageUrl, {
				folder: 'uploads',
				use_filename: true,
				unique_filename: true,
				overwrite: false,
			});

			console.log('Cloudinary upload result:', cloudinaryResult);

			const image = new Image({
				url: cloudinaryResult.secure_url,
				thumbnailUrl: cloudinaryResult.secure_url,
				album: albumId,
				user: userId,
				size: cloudinaryResult.bytes,
				filename: cloudinaryResult.original_filename,
				fileType: cloudinaryResult.format,
				dimensions: {
					width: cloudinaryResult.width,
					height: cloudinaryResult.height,
				},
				description: description || '',
				tags: tags || [],
				status: 'uploaded',
				isPublic: false, // Default to private
				isFavorite: false, // Default to not favorite
				views: 0, // Default to 0 views
				likes: 0, // Default to 0 likes
			});

			await image.save();

			res.status(201).json({
				message: 'Image uploaded and saved successfully',
				data: {
					cloudinary: cloudinaryResult,
					image: image,
				},
			});
		} catch (error) {
			console.error('Error uploading image to Cloudinary or saving to database:', error);
			res.status(500).json({ error: 'Failed to upload image or save to database' });
		}
	},

	getImageById: async (req, res) => {
		try {
			const image = await Image.findById(req.params.imageId).populate('album user');
			if (!image) {
				return res.status(404).json({ message: 'Image not found' });
			}
			res.status(200).json(image);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	updateImage: async (req, res) => {
		try {
			const image = await Image.findByIdAndUpdate(req.params.imageId, req.body, {
				new: true,
			});
			if (!image) {
				return res.status(404).json({ message: 'Image not found' });
			}
			res.status(200).json(image);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	deleteImage: async (req, res) => {
		try {
			const image = await Image.findByIdAndDelete(req.params.imageId);
			if (!image) {
				return res.status(404).json({ message: 'Image not found' });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	getImagesByAlbum: async (req, res) => {
		try {
			const images = await Image.find({ album: req.params.albumId });
			res.status(200).json(images);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};

module.exports = imageService;
