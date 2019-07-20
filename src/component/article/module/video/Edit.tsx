import React, { FunctionComponent, memo } from 'react';
import { ContentModuleModel, FileModelType } from '../../../../model';
import { SelectFileOverlay } from 'component/edit/SelectFileOverlay';
import { Show } from './Show';

interface EditProps {
    contentModule: ContentModuleModel;
    onUpdateModule(contentModule: ContentModuleModel): void;
}

export const Edit: FunctionComponent<EditProps> = memo(({ contentModule, onUpdateModule }) => {
    return (
        <SelectFileOverlay
            label={'Video auswechseln'}
            fileFilter={f => f.fileType === FileModelType.Video}
            onSelectFile={file => onUpdateModule({ ...contentModule, files: [file] })}
        >
            <Show contentModule={contentModule} />
        </SelectFileOverlay>
    );
});