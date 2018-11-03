package nl.sijpesteijn.bblaser.repositories

import nl.sijpesteijn.bblaser.BBAnimation
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.Query
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository


@Repository
interface AnimationRepository : PagingAndSortingRepository<BBAnimation, String> {

    @Query("{ _id: { \$exists: true }}")
    fun retrieveAllAnimationsPaged(pageable: Pageable): Page<BBAnimation>
}