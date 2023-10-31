import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user_entity';
import { WordEntity } from './word_entity';
import { VocabularyEntity } from './vocabulary_entity';


@Entity('vocabulary_word')
export class VocabularyWordEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => VocabularyEntity)
    @JoinColumn()
    vocabulary!: VocabularyEntity

    @ManyToOne(() => WordEntity)
    @JoinColumn()
    word!: WordEntity;

}
