export const ProfileImage = ({ src }: { src: string }) => (
  <img
    src={src || "/avatar.png"}
    alt="profile"
    className="w-28 h-28 bg-gray-300 rounded-full object-cover border-4 border-primary-100 shadow-md"
  />
);
