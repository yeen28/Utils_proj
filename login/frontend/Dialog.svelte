<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';

	export let dialogOpen = false;
	export let dialogCallback;
	export let dialogType = 'alert'; // alert | confirm

	function closeHandler(e) {
		if (e.detail.action === 'accept') {
			dialogCallback();
		}
	}
</script>

<Dialog
	bind:open={dialogOpen}
	aria-labelledby="dialog-title"
	aria-describedby="dialog-content"
	on:SMUIDialog:closed={closeHandler}
>
	<Title id="dialog-title">
		<slot name="dialogTitle">알림</slot>
	</Title>

	<Content id="dialog-content">
		<slot name="dialogContent"></slot>
	</Content>
	<Actions>
		{#if dialogType === 'confirm'}
			<Button>
				<Label>취소</Label>
			</Button>
		{/if}
		<Button action="accept">
			<Label>확인</Label>
		</Button>
	</Actions>
</Dialog>
