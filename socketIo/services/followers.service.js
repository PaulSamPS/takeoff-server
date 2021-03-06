const Followers = require('../../models/followers.model')
const UserDto = require('../../dto/user.dto')
const ApiError = require('../../error/api.error')

const friendsRequestGet = async (userId) => {
  const folUser = await Followers.findOne({ user: userId }).populate('following.user')
  let followingsUser =
    folUser &&
    folUser.following.map((e) => {
      return new UserDto(e.user)
    })

  return { followingsUser }
}

const friendsGet = async (userId) => {
  const user = await Followers.findOne({ user: userId }).populate('friends.user')

  let friendsUser =
    user &&
    user.friends.map((e) => {
      return new UserDto(e.user)
    })

  return { friendsUser }
}

const friendsUSerInfoGet = async (userId) => {
  const user = await Followers.findOne({ user: userId }).populate('friends.user')

  let friendsUser =
    user &&
    user.friends.map((e) => {
      return new UserDto(e.user)
    })

  return { friendsUser }
}

const followersGet = async (userId) => {
  const user = await Followers.findOne({ user: userId }).populate('following.user')
  const folUser = await Followers.findOne({ user: userId }).populate('followers.user')

  let followingsUser =
    user &&
    user.following.map((e) => {
      return new UserDto(e.user)
    })

  let followersUser =
    folUser &&
    folUser.followers.map((e) => {
      return new UserDto(e.user)
    })

  return { followingsUser, followersUser }
}

const follow = async (userId, userToFollowId) => {
  const user = await Followers.findOne({ user: userId })
  const userToFollow = await Followers.findOne({ user: userToFollowId })

  const isFollowing =
    user.following.length > 0 && user.following.filter((following) => following.user.toString() === userToFollowId).length > 0

  if (isFollowing) {
    return console.log('Пользователь уже в друзьях')
  }

  await user.following.unshift({ user: userToFollowId })
  await user.save()

  await userToFollow.followers.unshift({ user: userId })
  await userToFollow.save()
}

const unfollow = async (userId, userToUnfollowId) => {
  const user = await Followers.findOne({
    user: userId,
  })

  const userToUnfollow = await Followers.findOne({
    user: userToUnfollowId,
  })

  const isFollowing =
    user.following.length > 0 && user.following.filter((following) => following.user.toString() === userToUnfollowId).length === 0

  const removeFollowing = await user.following.map((following) => following.user.toString()).indexOf(userToUnfollowId)

  user.following.splice(removeFollowing, 1)
  await user.save()

  const removeFollower = await userToUnfollow.followers.map((follower) => follower.user.toString()).indexOf(userId)

  userToUnfollow.followers.splice(removeFollower, 1)
  await userToUnfollow.save()
}

const addToFriends = async (userId, userToFriendId) => {
  const user = await Followers.findOne({ user: userId })
  const userToFriend = await Followers.findOne({ user: userToFriendId })

  const isFriend = user.friends.length > 0 && user.friends.filter((following) => following.user.toString() === userToFriendId).length > 0

  if (isFriend) {
    return { userFriends: user.friends }
  }

  await user.friends.unshift({ user: userToFriendId })
  await user.save()

  await userToFriend.friends.unshift({ user: userId })
  await userToFriend.save()

  let userFriends = user.friends

  return { userFriends }
}

module.exports = { followersGet, follow, unfollow, addToFriends, friendsRequestGet, friendsGet, friendsUSerInfoGet }
