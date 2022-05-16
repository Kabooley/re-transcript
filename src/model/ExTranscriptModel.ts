import { Model } from './Model';
import { iController , iSubtitles } from '../contentScript/controller';
import { Attributes } from '../attributes/Attributes';
import { Events } from '../events/Events';

export class ExTranscriptModel extends Model<iController> {
    static build(sStatusBase: iController): ExTranscriptModel {
        return new ExTranscriptModel(
            new Attributes<iController>(sStatusBase),
            new Events<iController>()
        );
    }
}

export class SubtitleModel extends Model<iSubtitles> {
    static build(sSubtitlesBase: iSubtitles): SubtitleModel {
        return new SubtitleModel(
            new Attributes<iSubtitles>(sSubtitlesBase),
            new Events<iSubtitles>()
        )
    }
}