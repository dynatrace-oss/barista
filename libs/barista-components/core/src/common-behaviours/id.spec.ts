/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { mixinId } from './id';

describe('MixinId', () => {
  it('should augment an existing class with an property', () => {
    class EmptyClass {}

    const classWithDisabled = mixinId(EmptyClass, 'dt-mixin-test');
    const instance = new classWithDisabled();

    // Expected the mixed-into class to have an id property
    expect(instance.id).toMatch(/dt-mixin-test-\d/);

    instance.id = 'my-id';
    // Expected the mixed-into class to have an updated id property
    expect(instance.id).toBe('my-id');
  });
});
