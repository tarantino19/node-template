// Example: Uploading an image to S3 and saving the URL in MongoDB
//Handling Image Uploads
const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS SDK
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

/**
 * Upload a file to S3.
 * @param {Object} file - The file to upload.
 * @returns {string} - The URL of the uploaded file.
 */
const uploadToS3 = async (file) => {
	const fileStream = fs.createReadStream(file.path);

	const uploadParams = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: file.filename,
		Body: fileStream,
	};

	const result = await s3.upload(uploadParams).promise();
	return result.Location; // Returns the S3 URL of the uploaded file
};

//Handling Storage Limits
const checkStorageLimit = async (userId, fileSize) => {
	const user = await User.findById(userId);
	if (user.storageUsed + fileSize > user.storageLimit) {
		throw new Error('Storage limit exceeded');
	}
};

const uploadImage = async (file, albumId, userId) => {
	try {
		// Step 1: Fetch the user's storage details
		const user = await User.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		// Step 2: Check if the user has enough storage
		const remainingStorage = user.storageLimit - user.storageUsed;
		if (file.size > remainingStorage) {
			throw new Error('Not enough storage available');
		}

		// Step 3: Upload the image to S3 or Cloudinary
		const s3Url = await uploadToS3(file); // Returns the URL of the uploaded image

		// Step 4: Save the image metadata in MongoDB
		const image = new Image({
			url: s3Url,
			album: albumId,
			user: userId,
			size: file.size,
		});
		await image.save();

		// Step 5: Update the user's storage usage
		await User.findByIdAndUpdate(userId, { $inc: { storageUsed: file.size } });

		return image;
	} catch (error) {
		throw error; // Propagate the error to the caller
	}
};

//Handling Shared Albums
// For shared albums, the isPublic field in the Album schema determines accessibility. If the album is private, a password is required.
const getSharedAlbum = async (albumId, password) => {
	const album = await Album.findById(albumId);
	if (!album.isPublic && album.password !== password) {
		throw new Error('Unauthorized access');
	}
	const images = await Image.find({ album: albumId });
	return { album, images };
};

module.exports = {
	uploadImage,
	checkStorageLimit,
	getSharedAlbum,
};
