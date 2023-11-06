package nl.sijpesteijn.bblaserservice.services;

import nl.sijpesteijn.bblaserservice.domain.BBAnimation;
import nl.sijpesteijn.bblaserservice.domain.BBAppearance;
import nl.sijpesteijn.bblaserservice.repositores.AnimationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AnimationService {

    private AnimationRepository animationRepository;

    public AnimationService(final AnimationRepository animationRepository) {
        this.animationRepository = animationRepository;
    }

    public Page<BBAnimation> getAnimations(final Pageable pageable) {
        return animationRepository.findAll(pageable);
    }

    public void save(BBAnimation animation) {
        animationRepository.save(animation);
    }

    public BBAnimation getAnimation(String id) {
        Optional<BBAnimation> bbAnimation = animationRepository.findById(id);
        if (bbAnimation.isPresent()) {
            return bbAnimation.get();
        }
        throw new IllegalArgumentException("Could not load animation with id " + id);
    }
}
