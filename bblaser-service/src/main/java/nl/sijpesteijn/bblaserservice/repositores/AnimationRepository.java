package nl.sijpesteijn.bblaserservice.repositores;

import nl.sijpesteijn.bblaserservice.domain.BBAnimation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimationRepository extends MongoRepository<BBAnimation, String> {
}
