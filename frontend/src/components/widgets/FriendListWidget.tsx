import { Box, Typography, useTheme } from "@mui/material";
// import { setFriends } from "state";
import Friend from "../Friend";
import WidgetWrapper from "../WidgetWrapper";

type FriendListWidgetProps = {
  userId: string | undefined;
};

const FriendListWidget = ({ userId }: FriendListWidgetProps) => {
  // const dispatch = useDispatch();
  const { palette } = useTheme();
  // const token = useSelector((state) => state.token);
  // const friends = useSelector((state:RootState) => state.user.friends);

  // const getFriends = async () => {
  //   const response = await fetch(
  //     `http://localhost:3001/users/${userId}/friends`,
  //     {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   const data = await response.json();
  //   dispatch(setFriends({ friends: data }));
  // };

  // useEffect(() => {
  //   getFriends();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const friends = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      occupation: "Software Engineer",
      picturePath: "https://randomuser.me/api/portraits",
    },
    {
      _id: "2",
      firstName: "Jane",
      lastName: "Doe",
      occupation: "Software Engineer",
      picturePath: "https://randomuser.me/api/portraits",
    },
    {
      _id: "3",
      firstName: "John",
      lastName: "Smith",
      occupation: "Software Engineer",
      picturePath: "https://randomuser.me/api/portraits",
    },
  ];

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
