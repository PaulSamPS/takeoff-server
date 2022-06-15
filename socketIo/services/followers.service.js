const Followers = require('../../models/followers.model')
const FollowersUserDto = require('../../dto/followerrsUser.dto')
const ApiError = require('../../error/api.error')

const friendsGet = async (userId) => {
  const folUser = await Followers.findOne({ user: userId }).populate('following.user')

  let followersUser = folUser.following.map((e) => {
    return new FollowersUserDto(e.user)
  })

  return { followersUser }
}

const followersGet = async (userId) => {
  const user = await Followers.findOne({ user: userId }).populate('following.user')
  const folUser = await Followers.findOne({ user: userId }).populate('followers.user')

  let followingsUser = user.following.map((e) => {
    return new FollowersUserDto(e.user)
  })

  let followersUser = folUser.followers.map((e) => {
    return new FollowersUserDto(e.user)
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

  let followingsUser = user.following
  let followersUser = user.followers

  return { followingsUser, followersUser }
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
    return console.log('Пользователь уже в друзьях')
  }

  await user.friends.unshift({ user: userToFriendId })
  await user.save()

  await userToFriend.friends.unshift({ user: userId })
  await userToFriend.save()

  let userFriends = user.friends

  return { userFriends }
}

module.exports = { followersGet, follow, unfollow, addToFriends, friendsGet }
