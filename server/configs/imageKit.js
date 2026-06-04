import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imagekit;