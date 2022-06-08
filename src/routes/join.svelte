<script lang="ts">
	import type { RoomAbstract } from 'src/app';

	import Card, {
		Content,
		PrimaryAction,
		Media,
		MediaContent,
		Actions,
		ActionButtons,
		ActionIcons
	} from '@smui/card';
	import Button, { Label } from '@smui/button';
	// import IconButton, { Icon } from '@smui/icon-button';

	let rooms: RoomAbstract[] = [];
</script>

<Card>
    <PrimaryAction >
        <Media class="card-media-16x9" aspectRatio="16x9" />
        <Content class="mdc-typography--body2">
            <h2 class="mdc-typography--headline6" style="margin: 0;">A card with media.</h2>
            <h3 class="mdc-typography--subtitle2" style="margin: 0 0 10px; color: #888;">
                And a subtitle.
            </h3>
            It's all in this card. It's a veritable smorgasbord of card features.
        </Content>
    </PrimaryAction>
    <Actions>
        <ActionButtons>
            <Button>
                <Label>Action</Label>
            </Button>
            <Button>
                <Label>Another</Label>
            </Button>
        </ActionButtons>
        <ActionIcons>
            
        </ActionIcons>
    </Actions>
</Card>

<style lang="scss">
    @import '../typography.scss';
</style>