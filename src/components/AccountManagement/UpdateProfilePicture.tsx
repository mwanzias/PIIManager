const UpdateProfilePicture = () => {
  return (
    <div>
      <h2>Update Profile Picture</h2>
      <p>Upload a new profile picture to update your account.</p>
      <input type="file" accept="image/*" />
      <button type="submit">Update Picture</button>
    </div>
  );
};

export default UpdateProfilePicture;
