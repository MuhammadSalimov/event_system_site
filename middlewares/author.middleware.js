const BaseError = require('../errors/base.error')
const prisma = require('../utils/connection')

module.exports = async function (req, res, next) {
	try {
		const post = await prisma.event.findUnique({
			where:{id:req.params.id}
		})
		const authorId = req.user.id
		if (post.organizerId !== authorId) {
			return next(BaseError.BadRequest('Only author can edit this post'))
		}
		next()
	} catch (error) {
		return next(BaseError.BadRequest('Only author can edit this post'))
	}
}
