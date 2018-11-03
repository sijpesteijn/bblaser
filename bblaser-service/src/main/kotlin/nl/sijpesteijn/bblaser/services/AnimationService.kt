package nl.sijpesteijn.bblaser.services

import nl.sijpesteijn.bblaser.BBAnimation
import nl.sijpesteijn.bblaser.repositories.AnimationRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Component
import java.util.*

@Component
class AnimationService(private val animationRepository: AnimationRepository) {
    fun all(pageable: Pageable): Page<BBAnimation> {
        return animationRepository.retrieveAllAnimationsPaged(pageable)
    }

    fun getById(id: String):Optional<BBAnimation> {
        return animationRepository.findById(id)
    }

    fun save(a: BBAnimation): BBAnimation {
        return animationRepository.save(a)
    }

    fun update(a: BBAnimation): BBAnimation {
        return animationRepository.save(a)
    }

    fun remove(id: String): Unit = animationRepository.deleteById(id)

}