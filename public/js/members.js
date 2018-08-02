function editMember(email, role,id) {
    $('#email').val(email);
    $('#role').val(role);
    $('#memberID').val(id);
    document.getElementById('saveForm').action = '/members/edit-member';
   // $("#addMember").collapse();
    //alert('Email= ' + email + ' & roll = ' + role);
}
function addMember(){
    $('#email').val("");
    $('#role').val("");
    document.getElementById('saveForm').action = '/members/add-member';
}
function deleteMember(email, role) {
    $.confirm({
        title: 'Delete!',
        content: 'Are you sure want to delete this user!',
        theme: 'material',
        buttons: {
            Yes: {
                btnClass: 'btn-danger',
                action:function(){
                    $('#delEmail').val(email);
                    $('#delRole').val(role);
                    $("#delForm").submit();
                }
            },
            No: {
                btnClass: 'btn-success',
                keys: ['enter', 'esc'],
            },
        }
    });
    //alert('Email= ' + email + ' & roll = ' + role);
}
